// PetRecords.js
import React, { Component, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

import Header from '../../components/Header.js';
import Footer from '../../components/Footer.js';
import PetNavBar from '../../components/PetNavBar.js';
import PetCard from '../../components/PetCard.js';

import Container from 'react-bootstrap/Container';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Jumbotron from 'react-bootstrap/Jumbotron';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

function PetRecords(props) {
  const [urlpetid, setUrlpetid] = useState(useParams());
  return (
    <div className="fullPageContainer">
        <div>
          <Header />
        </div>

        <Container fluid className="petProfileWindow">

          <div>
            <PetCard value={urlpetid} />
          </div>

          <div>
            <PetNavBar value={urlpetid} />
          </div>

        <div className="petProfileBody">
        <h4> Pet Record details here - Pet Record details here - Pet Record details here <br />
          Pet Record details here - Pet Record details here - Pet Record details here <br />
          Pet Record details here - Pet Record details here - Pet Record details here <br />
          Pet Record details here - Pet Record details here - Pet Record details here <br />
          Pet Record details here - Pet Record details here - Pet Record details here <br />
          Pet Record details here - Pet Record details here - Pet Record details here <br />
          Pet Record details here - Pet Record details here - Pet Record details here <br />
          Pet Record details here - Pet Record details here - Pet Record details here <br />
          </h4>
        </div>
        </Container>
        <div className="mainPageFooter">
          <Footer />
        </div> 
      </div>
    )
}

export default PetRecords