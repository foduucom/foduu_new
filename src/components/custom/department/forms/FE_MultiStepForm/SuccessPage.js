import React from 'react'
// import contact from './contact-success.png'
// import contactImg from 'contact-success.png'

const SuccessPage = () => {
    return (
        <div className="form-card">
                    
            <h2 className="purple-text text-center">
                <strong>SUCCESS !</strong>
            </h2>
            <br />
        
            <div className="row justify-content-center">
                <div className="col-3 text-center">
                    <img
                        width={100}
                        height={100}
                        src="contact-success.png"

                        className="fit-image"
                        alt="Success Image"
                    />
                </div>
            </div>
                     
            <div className="row justify-content-center">
                <div className="col-7 text-center">
                    <h5 className="purple-text text-center">
                        You Have Successfully Signed Up
                    </h5>
                </div>
            </div>
        </div>
    )
}

export default SuccessPage
