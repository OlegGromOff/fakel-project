import React, { useState, useEffect } from 'react';
import { Table } from 'reactstrap';
import PropTypes from "prop-types";
import classnames from 'classnames';
import { ButtonToggle } from 'reactstrap';
import _ from 'lodash';

const Projects = ({ toggleRow, activeId }) => {
  const [tableData, settableData] = useState([]); // основной массив
  const [currentPage, setCurrentPage] = useState(1); // номер страницы пагинация
  const [sort, setSort] = useState('asc');  // or 'desc'
  const [sortField, setSortField] = useState('id')
  const [search, setSearch] = useState('');
  const [postsPerPage, setPostsPerPage] = useState(5);
  const pageNumbers = [];
  let [currentPosts, setPosts] = useState([]); // посты с пагинацией
  let [cloneArray, setClone] = useState([]); // копия основного массива
  const [valueInput, setValue] = useState('');
  const valueChangeHandler = event => {
    setValue(event.target.value);
    setSearch(event.target.value);  // изменил search
  };
  let indexOfLastPost = [];
  let indexOfFirstPost = [];


  useEffect(() => {
    let url = "http://www.filltext.com/?rows=300&projectId=%7Bnumber%7C1000%7D&title=%7Bbusiness%7D&description=%7Blorem%7C32%7D&authorId=%7Bnumber%7C1000%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&billing=%7BccNumber%7CDISC%7D";
    fetch(url)
      .then(res => res.json())
      .then((data) => {
        settableData(data);
      })
      .catch(function (error) {
        console.log(error);
      })
  }, []);

  useEffect(() => {
    setClone(tableData.slice()); // обязатель в useEffect проводи эту процедуру, иначе будет too many re-renders error
  }, [tableData]);



  let paginate = (pageNumber) => { setCurrentPage(pageNumber) };
  indexOfLastPost = currentPage * postsPerPage;
  indexOfFirstPost = indexOfLastPost - postsPerPage;

  useEffect(() => {
    setPosts(cloneArray.slice(indexOfFirstPost, indexOfLastPost)); // задаю посты с пагинацией
  }, [cloneArray, indexOfFirstPost, indexOfLastPost]);

  let searchHandler;
  searchHandler = val => {
    setSearch(val);  // изменил search
    setCurrentPage(1);
    if (!search) {
      settableData(tableData)
    }
    setClone(cloneArray.filter(item => {  // поиск по title по совпадению 
      return item['title'].toLowerCase().includes(search.toLowerCase())
    }))
  };

  const onSort = sortField => {
    const sortType = sort === 'asc' ? 'desc' : 'asc'; // если sort = asc то меняю на противоположный и наоборот
    const orderedData = _.orderBy(cloneArray, sortField, sortType);
    // сортирую нашу копию массива данных по полю sortField в направлении sortType
    setClone(orderedData);
    setSort(sortType);
    setSortField(sortField);
  }

  for (let i = 1; i <= Math.ceil(tableData.length / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  let searchClear = () => {
    setClone(tableData.slice());
  };

  return <>
    {
      tableData ?
        <div>

          <div className="btn-row">
            <input type="text"
              className="form-control input-field"
              onChange={valueChangeHandler}
              value={valueInput} placeholder='Фильтр по "title"' />
            <div className="btn-wrapper">
              <ButtonToggle color="primary" onClick={() => searchHandler(valueInput)}>Отфильтровать</ButtonToggle>{' '}
              <ButtonToggle color="danger" onClick={() => searchClear()}>Очистить поиск</ButtonToggle>{' '}
            </div>
          </div>
          < Table bordered className="table-wrapper" >
            <thead>
              <tr>
                <th onClick={onSort.bind(null, 'projectId')}>Project Id</th>
                <th onClick={onSort.bind(null, 'title')}>Title</th>
                <th onClick={onSort.bind(null, 'description')}>Description</th>
                <th onClick={onSort.bind(null, 'authorId')}>Author Id</th>
                <th onClick={onSort.bind(null, 'phone')}>Phone</th>
                <th onClick={onSort.bind(null, 'billing')}>Billing</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.map((item) => (
                <tr key={Math.random()} className={classnames({ 'table-row': true, active: activeId === item.phone })}
                  onClick={() => { toggleRow(item.phone); }}>
                  <th>{item.projectId}</th>
                  <td>{item.title}</td>
                  <td>{item.description}</td>
                  <td>{item.authorId}</td>
                  <td>{item.phone}</td>
                  <td>{item.billing}</td>
                </tr>
              ))}
            </tbody >
          </ Table>
          <div>
            <nav>
              <ul className='pagination'>
                <li><a className="link-prev page-link" href={void (0)} onClick={() => paginate(currentPage - 1)} >
                  <span>‹</span></a></li>
                <ul className="pagination inner-pagination" >
                  {pageNumbers.map(number => (
                    <li key={number} className="page-item">
                      <a onClick={() => paginate(number)} href={void (0)}
                        className={currentPage === number ? "page-link active" : "page-link"}
                      >
                        {number}
                      </a>
                    </li>
                  ))}
                </ul>
                <li><a onClick={() => paginate(currentPage + 1)}
                  className="link-next page-link" href={void (0)}  >
                  <span>›</span></a></li>
              </ul>
            </nav>
          </div>
        </div>
        : <h3>Loading.....</h3>
    }
  </>
}


Projects.propTypes = {
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

export default Projects;