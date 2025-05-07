import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../../Style/AdminCss/AdminNav.css";
import axios from 'axios';
import { api } from '../../api/api';

const AdminNav = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpenAdminVideoAdvertise, setIsDropdownOpenAdminVideoAdvertise] = useState(false);
  const [isDropdownDashbord, setIsDropdownDashbord] = useState(false);

  const navigate = useNavigate();
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
    setIsDropdownDashbord(false);

  };
  const toggleDropdownAdminVideoAdvertise = () => {
    setIsDropdownDashbord(false);
    setIsDropdownOpenAdminVideoAdvertise((prev) => !prev);

  };

  const toggleDashbord = () => {
    setIsDropdownDashbord(true);
    navigate("/dashboard")
  }

  const handleInvestors = async() => {
    setIsDropdownDashbord(false);

    const response = await axios.get(api.investors.getAllInvestor);
    console.log(response.data);
  }

  const handleCreateAdvertise = async() => {
    setIsDropdownDashbord(false);

    navigate("/createVideoAdvertise")
  }
  const handleTopOne = async() => {
    setIsDropdownDashbord(false);

    navigate("/topOneVideoAdvertise")
  }
  const handleTopTwo = async() => {
    setIsDropdownDashbord(false);
    navigate("/topTwoVideoAdvertise")
  }

  const handleTopThree = async() => {
    setIsDropdownDashbord(false);
    navigate("/topThreeVideoAdvertise")
  }

  const handleGetAllvideo = async() => {
    navigate("/getAllVideoAdvertise")
    setIsDropdownDashbord(false);
  }

  return (
    <div className="admin-nav-container">
      <header className="admin-header">
        <h2 className="admin-title">MR FRANCHIES</h2>
      </header>

      <div className="dropdown">
          <div
            className={`dropdown-toggle ${isDropdownDashbord ? 'open' : ''}`}
            onClick={toggleDashbord}
          >
            Dashbord
          </div>
      </div>

      <div className="dropdown">
       <div
  className={`dropdown-toggle ${isDropdownOpen ? 'open' : ''}`}
  onClick={toggleDropdown}
>
  Investor
</div>

        {isDropdownOpen && (
          <div className="dropdown-menu">
            <ul>
              <li onClick={handleInvestors}><a href="#">All Investor</a></li>
              <li><Link to="/admin/addFranchise">Add Investor</Link></li>
              <li><Link to="/admin/updateFranchise">Update Investor</Link></li>
              <li><Link to="/admin/deleteFranchise">Delete Investor</Link></li>
            </ul>
          </div>
        )}
      </div>
      <div className="dropdown">
       <div
  className={`dropdown-toggle ${isDropdownOpenAdminVideoAdvertise ? 'open' : ''}`}
  onClick={toggleDropdownAdminVideoAdvertise}
>
AdminVideoAdvertisement
</div>

        {isDropdownOpenAdminVideoAdvertise && (
          <div className="dropdown-menu">
            <ul>
              <li onClick={handleCreateAdvertise}><a>Create Video Advertise</a></li>
              <li onClick={handleTopOne}><a>Top One</a></li>
              <li onClick={handleTopTwo}><a>Top Two</a></li>
              <li onClick={handleTopThree}><a>Top Three</a></li>
              <li onClick={handleGetAllvideo}><a>All Video Advertise</a></li>
              
            </ul>
          </div>
        )}
      </div>

      
    </div>
  );
};

export default AdminNav;
