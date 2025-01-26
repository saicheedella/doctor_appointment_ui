export function setItemHelper(state, setState) {
    const setItem = (key) => {
        return  value => {
            setState({
                ...state,
                [key]: value
            });
        };
    };

    return setItem
};
