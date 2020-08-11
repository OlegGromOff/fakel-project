import React, { useState, useEffect } from 'react';
import { Table, ButtonToggle } from 'reactstrap';
import PropTypes from "prop-types";
import classnames from 'classnames';
import _ from 'lodash';

const Users = ({ toggleRow, activeId }) => {
  const [tableUsers, setTableUsers] = useState([]); // состояние массива данных с сервера
  const [sort, setSort] = useState('asc');  // or 'desc'
  const [sortField, setSortField] = useState('id');
  const [search, setSearch] = useState('');
  const [valueInput, setValue] = useState('');
  let [cloneArrayU, setCloneU] = useState([]); // копия основного массива
  const valueChangeHandler = event => {
    setValue(event.target.value);
    setSearch(event.target.value);
  };

  useEffect(() => {
    let url = "http://www.filltext.com/?rows=32&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&adress=%7BaddressObject%7D&description=%7Blorem%7C32%7D";
    fetch(url)
      .then(res => res.json())
      .then((data) => {
        setTableUsers(data)
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    setCloneU(tableUsers.slice()); // обязательно в useEffect проводи эту процедуру, иначе будет too many re-renders error
    // console.log('tableUsers', tableUsers);
  }, [tableUsers]);


  let searchHandler;
  searchHandler = function (event, val) {
    event.preventDefault();
    if (!search) {
      setTableUsers(tableUsers)
    }
    setCloneU(cloneArrayU.filter(item => {  // поиск по email по совпадению 
      return item['email'].toLowerCase().includes(search.toLowerCase())
    }))
    console.log("search", search)
  };

  const onSort = sortField => {
    // const cloneData = tableUsers.concat(); // клонирую массив данных с сервера
    const sortType = sort === 'asc' ? 'desc' : 'asc'; // если sort = asc то меняю на противоположный и наоборот
    const orderedData = _.orderBy(cloneArrayU, sortField, sortType);
    // сортирую нашу копию массива данных по полю sortField в направлении sortType
    setCloneU(orderedData);
    setSort(sortType);
    setSortField(setSortField);
  }
  let searchClear = () => {
    setCloneU(tableUsers.slice());
    setValue('');
  };

  return <>
    {tableUsers ?
      <>
        <form action="" onSubmit={(event) => searchHandler(event, valueInput)}>
          <div className="btn-row">
            <input type="text" placeholder='Фильтр по "email"'
              onChange={valueChangeHandler}
              value={valueInput}
              className="form-control input-field" />
            <div className="btn-wrapper">
              <ButtonToggle color="primary" type="submit">Отфильтровать</ButtonToggle>{' '}
              <ButtonToggle color="danger" onClick={() => searchClear()}>Очистить поиск</ButtonToggle>{' '}
            </div>
          </div>
        </form>
        < Table bordered className="table-wrapper">
          <thead>
            <tr >
              <th onClick={onSort.bind(null, 'id')}> Id</th>
              <th onClick={onSort.bind(null, 'firstName')}> First Name</th>
              <th onClick={onSort.bind(null, 'lastName')}> Last Name</th>
              <th onClick={onSort.bind(null, 'email')}> Email</th>
              <th onClick={onSort.bind(null, 'phone')}> Phone</th>
              <th onClick={onSort.bind(null, 'adress.city')} > Address(streetAddress, city, state, zip)</th>
            </tr>
          </thead>
          <tbody>
            {cloneArrayU.map((item) => (
              <tr key={Math.random()} className={classnames({ 'table-row': true, active: activeId === item.id })}
                onClick={() => { toggleRow(item.id); }}>
                <th>{item.id}</th>
                <td>{item.firstName}</td>
                <td>{item.lastName}</td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
                <td>{item.adress.streetAddress}, {item.adress.city}, {item.adress.state}, {item.adress.zip}</td>
              </tr>
            ))}
          </tbody >
        </ Table>
      </>
      : "Loading....."}
  </>;
}
Users.propTypes = {
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  size: PropTypes.string,
  bordered: PropTypes.bool,
  borderless: PropTypes.bool,
  striped: PropTypes.bool,
  dark: PropTypes.bool,
  hover: PropTypes.bool,
  responsive: PropTypes.bool,
  innerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
    PropTypes.object
  ])
};

export default Users;