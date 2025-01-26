import React, { useState, useEffect } from 'react';
import Header from '../elements/header';
import Sidebar from '../elements/PatientSidebar';
import { Link } from 'react-router-dom';
import { Button, Card, Form, Modal } from 'react-bootstrap';
import Select from 'react-select';
import { setItemHelper } from '../utils';
import { bookAppointment, getDepartments, getDoctors, getSlots } from '../apis';
import Avatar from 'react-avatar';
import { useSelector } from 'react-redux';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { useHistory } from 'react-router-dom';
import ReactQuill from 'react-quill';
import ReactHtmlParser from 'react-html-parser';
import LoadingIndicator from '../components/LoadingIndicator';

const DoctorSearch = () => {
  const [filters, setfilters] = useState({});
  const [doctors, setdoctors] = useState({});
  const [departments, setdepartments] = useState([]);

  const setFilterField = setItemHelper(filters, setfilters);

  useEffect(() => {
    fetchDoctors();
    // eslint-disable-next-line
  }, [filters]);

  const fetchDoctors = () => {
    getDoctors({
      ...filters,
      gender: filters.gender && filters.gender.value,
    }).then((res) => {
      if (res.success) {
        setdoctors(res.doctors);
      } else {
        return;
      }
    });
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = () => {
    getDepartments().then((res) => {
      if (res.success) {
        setdepartments(res.departments);
      }
    });
  };

  return (
    <div>
      <Header />
      <div id='wrapper'>
        <Sidebar></Sidebar>
        <div id='content-wrapper'>
          <div className='container-fluid'>
            <ol className='breadcrumb'>
              <li className='breadcrumb-item'>
                <Link to={'/dashboard'}>Find A Doctor</Link>
              </li>
            </ol>
            <div className='container'>
              <div className='row'>
                <div className='container d-flex'>
                  <div className='col-6'>
                    <Form.Control onChange={(e) => setFilterField('name')(e.target.value)} placeholder='Search' />
                  </div>
                  <div className='col'>
                    <Select
                      options={departments.map((a) => ({ ...a, value: a.id }))}
                      isMulti={false}
                      onChange={setFilterField('department')}
                      placeholder='Department'
                      isClearable
                    />
                  </div>
                  <div className='col'>
                    <Select
                      options={['Male', 'Female', 'Others'].map((a) => ({ id: a, label: a, value: a, name: a }))}
                      isMulti={false}
                      onChange={setFilterField('gender')}
                      placeholder='Gender'
                      isClearable
                    />
                  </div>
                </div>
              </div>
              <div className='row no-gutters justify-content-around mt-5'>
                {doctors && doctors.length > 0 && doctors.map((d) => <Doctor key={d.id} doctor={d} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Doctor = ({ doctor }) => {
  const { user } = useSelector((s) => s.userDetails);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [date, setdate] = useState(null);
  const [slots, setslots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [description, setdescription] = useState(null);
  const [loading, setloading] = useState(false);

  const history = useHistory();

  useEffect(() => {
    if (isModalOpen && date) {
      fetchSlots();
    }
    // eslint-disable-next-line
  }, [date, isModalOpen]);

  const fetchSlots = () => {
    getSlots({
      date,
      doctorId: doctor.id,
    }).then((res) => {
      if (res.success) {
        setslots(res.slots);
      } else {
        return;
      }
    });
  };

  const handleBookSlot = () => {
    // slotId, patientId, description
    setloading(true);
    bookAppointment({
      patientId: user.id,
      description,
      slotId: selectedSlot.id,
    }).then((res) => {
      if (res.success) {
        setdate(new Date());
        setSelectedSlot(null);
        setdescription(null);
        setloading(false);
        history.push('/appointments');
      } else {
        return;
      }
    });
  };

  return (
    <Card style={{ minHeight: '180px' }} className='col-5 mb-2 shadow'>
      <div className='row no-gutters'>
        <div className='col-4 border-right'>
          <div className='text-center my-4'>
            {!doctor.photo ? (
              <Avatar color='#212529' round size={100} name={doctor.name} />
            ) : (
              <img
                width='100'
                height='100'
                style={{ borderRadius: '50%' }}
                src={`http://localhost:8000/api/image/${doctor.photo}`}
                alt=''
              />
            )}
            <h6 className='mb-0'>Dr. {doctor.name}</h6>
            <div className='small text-muted'>{doctor.department && doctor.department.label}</div>
          </div>
        </div>
        <div className='col p-2 align-middle td'>
          <p style={{ fontSize: '14px', height: '125px', overflow: 'scroll' }} className='text-muted text-justify'>
            {ReactHtmlParser(doctor.about)}
          </p>
          <div className='text-center'>
            <Button onClick={(e) => setisModalOpen(true)}>Book an appointment</Button>
          </div>
        </div>
      </div>
      <Modal centered show={isModalOpen} onHide={(e) => setisModalOpen(false)}>
        <Modal.Header closeButton>Book An Appointment with Dr.{doctor.name}</Modal.Header>
        <Modal.Body>
          <Form.Group controlId='dob'>
            <Form.Label>Select Date</Form.Label>
            <DatePicker
              dateFormat='dd/MM/yyyy'
              selected={date}
              minDate={moment().toDate()}
              onChange={(newDate) => setdate(newDate)}
            />
          </Form.Group>
          {date && (
            <>
              <Form.Group className='mt-3'>
                <Form.Label>Select Slot</Form.Label>
                <Select
                  options={slots
                    .map((a) => ({
                      ...a,
                      value: a.id,
                      disabled: a.booked,
                      label: moment(a.startTime).format('hh:mm A'),
                    }))
                    .reverse()}
                  isMulti={false}
                  onChange={setSelectedSlot}
                  placeholder='Slot'
                  isClearable
                  isOptionDisabled={(option) => option.disabled}
                />
              </Form.Group>
              <Form.Group>
                <div className='form-label-group mt-3'>
                  <ReactQuill value={description} onChange={(v) => setdescription(v)} />
                </div>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <LoadingIndicator isLoading={loading}>
            <div className='text-right'>
              <Button onClick={handleBookSlot} disabled={!description || !selectedSlot || !date}>
                Proceed
              </Button>
            </div>
          </LoadingIndicator>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};
export default DoctorSearch;
