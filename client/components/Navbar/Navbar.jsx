import React, {useState, useEffect, useContext} from 'react';
import Image from "next/image";
import Link from "next/link";

// Internal imports
import Style from "./Navbar.module.css";
import { ChatAppContext } from '../../Context/ChatAppContext';
import {Model, Error} from "../index";
import images from "../../assets";

const Navbar = () => {
  const {account, userName, connectWallet, createAccount, error } = useContext(ChatAppContext);

  const menuItems = [
    {
      menu: "All users",
      link: "allUser"
    },
    {
      menu: "Chat",
      link: "/"
    },
    {
      menu: "Contact",
      link: "/"
    },
    {
      menu: "FAQs",
      link: "/"
    },
    {
      menu: "Terms of use",
      link: "/"
    }
  ]

  // Usestates
  const [active, setActive] = useState(2);
  const [open, setOpen] = useState(false);
  const [openModel, setOpenModel] = useState(false)

  

  return (
    <div className={Style.Navbar}>
      <div className={Style.Navbar_box}>
        <div className={Style.Navbar_box_left}>
          <Image src={images.logo} alt = "logo" width={50} height={50}/>
        </div>
        <div className={Style.Navbar_box_right}>

          {/* For desktop */}
          <div className={Style.Navbar_box_right_menu}>
            {menuItems.map((NavbarElement, i) => (
              <div 
                  onClick={() => setActive(i + 1)} 
                  key = {i + 1} 
                  className = {`${Style.Navbar_box_right_menu_items} ${active == i + 1 ? Style.active_btn : ""}`}>
                    <Link className={Style.Navbar_box_right_menu_items_link} href={NavbarElement.link}>
                      {NavbarElement.menu}
                    </Link>
                  </div>
            ))}

          </div>

          {/* For Mobile devices */}
          {/* <Image src={images.logo} alt = "logo" width={50} height={50}/> */}
          {open && (
               <div className={Style.mobile_menu}>
                 {menuItems.map((NavbarElement, i) => (
                   <div 
                       onClick={() => setActive(i + 1)} 
                       key = {i + 1} 
                       classNam = {`${Style.mobile_menu_items} ${active == i + 1 ? Style.active_btn : ""}`}>
                      <Link className={Style.mobile_menu_items_link} href={NavbarElement.link}>
                       {NavbarElement.menu}
                      </Link>
                   </div>
                 ))}

                 <p className={Style.mobile_menu_btn}>
                  <Image src= {images.close} alt = "close" width={50} height={50} 
                         onClick = {() => setOpen(false)}
                  />
                 

                 </p>

               </div>
        )}

        {/* Connect wallet */}
        <div className={Style.Navbar_box_right_connect}>
          {account == "" ? (
           <button 
                 onClick={() => connectWallet()}> {""} <span>Connect Wallet</span>
           </button>) : (
            <button onClick={() => setOpenModel(true)}> {""}
            <Image 
                  src={userName ? images.accountName : images.create2}
                  alt = "account Image"
                  width={20}
                  height={20}
            />
            {""}
            <small>{userName || "CreateAccount" }</small>
            </button>
           )}
        </div>

        <div className={Style.Navbar_box_right_open} onClick={() => setOpen(true)} >
          <Image src={images.open} alt = "open" width={30} height={30}/>
        </div>
        </div>
      </div>

      {/* Open component */}
      {openModel && (
        <div className={Style.modelBox}>
          <Model 
                 openBox={setOpenModel}
                 title="Welcome To"
                 head = "Chat body"
                 info="Lorem ipsum, dolor sit amet consectetur adipisicing elit."
                 smallInfo="Kindly select your name.."
                 image={images.hero}
                 functionName={createAccount}
                 address = {account}
                 />
        </div>
      )}
      {error == "" ? "" : <Error error = {error} />}
    </div>
 )
}

export default Navbar