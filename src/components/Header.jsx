//file: src/components/Header.js
import React from 'react';
import logo from '../images/xvlogo.png';
const Header = () => {
return (
    <header>
        <img src={logo} alt="Xcelvations Logo" height="40" />
    </header>
    );
};
export default Header;