import React from 'react';
import './Services.css';
import hardwareSupportImage from './img/computer_4377941.png'; // استيراد الصور
import softwareAssistanceImage from './img/online-discussion_11747925.png';
import networkSolutionsImage from './img/online-idea (1).png';
import 'animate.css';

const services = [
    { 
        title: "Hardware Support", 
        description: "Repair and maintenance of desktops, laptops, and peripherals.", 
        image: hardwareSupportImage 
    },
    { 
        title: "Software Assistance", 
        description: "Installation, troubleshooting, and updates for various software.", 
        image: softwareAssistanceImage 
    },
    { 
        title: "Network Solutions", 
        description: "Setup and maintenance of business and home networks.", 
        image: networkSolutionsImage 
    }
];


function Services() {
    return (
        <div className="container" style={{ paddingTop: "150px" }}>
            <h2 className="text-center mb-4 animate__animated animate__fadeIn" style={{ fontFamily: "var(--font-heading)", color: "#ffffff", fontWeight: "800", fontSize: "40px", paddingBottom: "30px" }}>
                Our Services
            </h2>
            <div className="row justify-content-center">
                {services.map((service, index) => (
                    <div key={index} className="col-md-4 mb-4 animate__animated animate__fadeInUp" style={{ animationDelay: `${index * 0.2}s` }}>
                        <div className="card d-flex justify-content-center align-items-center" style={{ backgroundColor: "#18181b", color: "#fff", border: "none" }}>
                            <img src={service.image} alt={service.title} className="card-img-top" style={{ borderTopLeftRadius: "20px", borderTopRightRadius: "20px",width:"190px" ,  objectFit: "cover" }} />
                            <div className="card-body text-center">
                                <h4 className="card-title">{service.title}</h4>
                                <p className="card-text">{service.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Services;