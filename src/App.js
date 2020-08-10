import React, { useState } from 'react';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.css';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import Projects from './components/projects';
import Users from './components/users';


function App() {
  const [activeTab, setActiveTab] = useState('1');
  const [activeId, setActiveId] = useState(''); // активный ряд
  // const [currentPage, setcurrentPage] = useState(0); // номер страницы пагинация

  const toggleRow = id => { // переключаю между рядами класс active
    if (activeId !== id) setActiveId(id);
  }

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  }


  return (
    <div className="App">
      <div className="container">
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '1' })}
              onClick={() => { toggle('1'); }}
            >
              Projects Tab
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '2' })}
              onClick={() => { toggle('2'); }}
            >
              Users Tab

            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <Row className="scroll-row">
              <Col sm="12">
                <Projects toggleRow={toggleRow} activeId={activeId} />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row className="scroll-row">
              <Col sm="12">
                <Users toggleRow={toggleRow} activeId={activeId} />
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </div>
    </div>
  );
}

export default App;
