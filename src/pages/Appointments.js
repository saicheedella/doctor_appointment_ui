import React, { useState, useEffect } from 'react';
import Header from '../elements/header';
import Sidebar from '../elements/PatientSidebar';
import DocSidebar from '../elements/DoctorSideBar';
import { Link } from 'react-router-dom';
import { Button, Card, Modal } from 'react-bootstrap';
import { getAppointments, savePrescription } from '../apis';
import Avatar from 'react-avatar';
import { useSelector } from 'react-redux';
import moment from 'moment';
import rxIcon from '../assets/rxicon.png';
import { setItemHelper } from '../utils';
import ReactQuill from 'react-quill';
import ReactHtmlParser from 'react-html-parser';
import LoadingIndicator from '../components/LoadingIndicator';

const Appointments = () => {
  const [appointments, setappointments] = useState([]);
  const { user } = useSelector((s) => s.userDetails);

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line
  }, []);

  const fetchAppointments = () => {
    getAppointments({ id: user.id }).then((res) => {
      if (res.success) {
        setappointments(res.appointments);
      }
    });
  };

  return (
    <div>
      <Header />
      <div id='wrapper'>
        {user.userTypeId === 2 ? <DocSidebar></DocSidebar> : <Sidebar></Sidebar>}
        <div id='content-wrapper'>
          <div className='container-fluid'>
            <ol className='breadcrumb'>
              <li className='breadcrumb-item'>
                <Link to={'/appointments'}>Appointments</Link>
              </li>
            </ol>
            <div className='container'>
              <div className='row no-gutters justify-content-around mt-5'>
                {appointments &&
                  appointments.length > 0 &&
                  appointments.map((d) => <AppointmentCard key={d.id} app={d} user={user} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AppointmentCard = ({ app, user }) => {
  const [appointment, setappointment] = useState(app);
  const doctor = appointment.doctor;
  const patient = appointment.patient;
  const slot = appointment.slot;
  const [isModalOpen, setisModalOpen] = useState(false);
  const [loading, setloading] = useState(false);

  const setAppointment = setItemHelper(appointment, setappointment);

  const handleSavePrescription = () => {
    setloading(true);
    savePrescription({
      prescription: appointment.prescription,
      appointmentId: app.id,
    }).then((res) => {
      if (res.success) {
        setloading(false);
        setisModalOpen(false);
      } else {
        return;
      }
    });
  };

  return (
    <Card style={{ minHeight: '180px' }} className='col-5 mb-5 shadow'>
      <div className='row no-gutters position-relative'>
        <img src={rxIcon} alt='' height={'30px'} style={{ opacity: '0.6' }} className='position-absolute m-2' />
        <div style={{ height: '100px' }} className=''></div>
        {user.userTypeId === 1 && (
          <div style={{ right: 0 }} className='position-absolute m-2'>
            <div className='text-center'>
              {!doctor.photo ? (
                <Avatar color='#212529' round size={50} name={doctor.name} />
              ) : (
                <img
                  width='50'
                  height='50'
                  style={{ borderRadius: '50%' }}
                  src={`http://localhost:8000/api/image/${doctor.photo}`}
                  alt=''
                />
              )}
              <p className='mb-0'>Dr. {doctor.name}</p>
              <div className='small text-muted'>{doctor.department && doctor.department.label}</div>
            </div>
          </div>
        )}
        {user.userTypeId === 2 && (
          <div style={{ right: 0 }} className='position-absolute m-2'>
            <div className='text-center'>
              {!patient.photo ? (
                <Avatar color='#212529' round size={50} name={patient.name} />
              ) : (
                <img
                  width='50'
                  height='50'
                  style={{ borderRadius: '50%' }}
                  src={`http://localhost:8000/api/image/${patient.photo}`}
                  alt=''
                />
              )}
              <p className='mb-0'>{patient.name}</p>
            </div>
          </div>
        )}
      </div>

      <div className='border-top p-2'>
        <div className='row no-gutters'>
          <div className='col border small p-1 text-center'>Patient details</div>
        </div>
        <div className='row no-gutters'>
          <div className='col border small p-1 text-center'>
            Name: <br /> {patient.name}
          </div>
          <div className='col border small p-1 text-center'>
            Age: <br /> {moment().diff(patient.dob, 'years', false)} years
          </div>
          <div className='col border small p-1 text-center'>
            Gender: <br /> {patient.gender}
          </div>
        </div>
        <div className='row no-gutters'>
          <div className='col border small p-2'>
            Appointment Date: <br /> {moment(slot.startTime).format('DD/MM/YYYY hh:mm A')}
          </div>
          <div className='col border small p-2 text-right'>
            Booked At: <br /> {moment(appointment.createdAt).format('DD/MM/YYYY hh:mm A')}
          </div>
        </div>
        <p style={{ fontSize: '14px', fontWeight: '600' }} className='p-0 m-0 mt-1'>
          Patient Description:
        </p>
        <div style={{ fontSize: '14px', height: '125px', overflow: 'scroll' }} className='text-justify'>
          {ReactHtmlParser(appointment.description)}
        </div>
        {appointment.prescription && (
          <div className='position-relative'>
            {user.userTypeId === 2 && (
              <div style={{ right: 0 }} className='position-absolute'>
                <Button className='btn-sm' onClick={(e) => setisModalOpen(true)}>
                  Edit
                </Button>
              </div>
            )}
            <p style={{ fontSize: '14px', fontWeight: '600' }} className='p-0 m-0 mt-1 border-top'>
              Doctor prescription:
            </p>
            <div style={{ fontSize: '14px', height: '125px', overflow: 'scroll' }} className='text-justify'>
              {ReactHtmlParser(appointment.prescription)}
            </div>
          </div>
        )}
        {user.userTypeId === 2 && !appointment.prescription && (
          <div className='text-center border-top'>
            <Button className=' mt-5' onClick={(e) => setisModalOpen(true)}>
              Add Prescription
            </Button>
          </div>
        )}
      </div>
      <Modal centered show={isModalOpen} onHide={(e) => setisModalOpen(false)}>
        <Modal.Header closeButton>Add prescription for {patient.name}</Modal.Header>
        <Modal.Body>
          <ReactQuill value={appointment.prescription} onChange={setAppointment('prescription')} />
        </Modal.Body>
        <Modal.Footer>
          <LoadingIndicator isLoading={loading}>
            <div className='text-right'>
              <Button onClick={handleSavePrescription} disabled={!appointment.prescription}>
                Proceed
              </Button>
            </div>
          </LoadingIndicator>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};
export default Appointments;
