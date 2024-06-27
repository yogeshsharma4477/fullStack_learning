import React, { useEffect, useState } from "react";
import styles from "./gotquestion.module.scss";

const TOTAL_QUESTION_COUNT = 10;
const QUESTION_COUNT_ON_FIRST_LOAD = 4;

export default function Gotquestion() {

  const [noOfQuestionToShow, setNoOfQuestionToShow] = useState(QUESTION_COUNT_ON_FIRST_LOAD);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Scroll to the active section when it changes
    if (isActive) {
      const activeElement = document.querySelector(`.active`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [isActive]);

  const handleAccordian = (index) => {
    setIsActive((prevIsActive) =>
      prevIsActive === index ? null : index
    );
  }

  function RenderComponent() {
    const RenderComponentArr = [
      <>
        <summary tabIndex="0" className={`fw600`}>
          What are the benefits of listing a business on Justdial?
        </summary>
        <p>
          Justdial is India's No. 1 local search platform and provides a range of benefits for businesses listed on the platform such as
        </p>
        <ul>
          <li>
            Boost your online presence and get more customers - Justdial has a customer base of 17+ crore. Listing your business will help you reach out to these users when your business listing or your business category is searched on Justdial.
          </li>
          <li>
            Create an online catalogue to showcase your ready-to-buy products or services for prospective clients seeking for more detailed information.
          </li>
          <li>
            Build Trust - Having an online presence on Justdial will help you build trust with customers and engage with them via reply to reviews and questions.
          </li>
          <li>
            Publish Deals, Menu, Rate Card, Brochure, etc to inform your potential customers about your business offerings.
          </li>
        </ul>
      </>,
      <>
        <summary tabIndex="0" className={`fw600`}>
          Can I list my business for FREE on Justdial?
        </summary>
        <p>
          Totally! Just add your phone number, address, and business type – it's super easy!
        </p>
      </>,
      <>
        <summary tabIndex="0" className={`fw600`}>
          I already have a website and social media. Do I still need Justdial?
        </summary>
        <div>
          <p>
            Yes, your free business listing complements your website and social media presence. Adding your website and social media handles to your Justdial profile will make your site more visible to customers searching for your business listing or category.
          </p>
        </div>
      </>,
      <>
        <summary tabIndex="0" className={`fw600`}>
          Do I need to download the Jd App to create and manage my business listing?
        </summary>
        <p>
          You are not required to download the Justdial app to create or manage your listing. Both our website and mobile browser offer user-friendly interfaces for this purpose. However, the app provides additional features, such as competitor tracking, which can be a valuable tool for optimizing your online presence. 
        </p>
      </>,
      <>
        <summary tabIndex="0" className={`fw600`}>
          How do I pick the right categories for my business?
        </summary>
        <p>
          Think about how your target audience would search for your business. If you operate a gym, selecting categories like "Fitness Center Services" or "Wellness and Physical Activity Facilities" will help potential customers find you when they're online. The more accurate and targeted your chosen categories, the higher your visibility becomes.
        </p>
      </>,
      <>
        <summary tabIndex="0" className={`fw600`}>
          How do I add my Whatsapp number to my business profile?
        </summary>
        <p>
          In the free listing form, you have the option to add your WhatsApp number. You can also update your contact information via the 'My Business' section on Justdial.
        </p>
      </>,
      <>
        <summary tabIndex="0" className={`fw600`}>
          Can I change my listing information after I create it?
        </summary>
        <p>
          Absolutely! Just go to the ""My Business"" section on Justdial and update details like your phone number, address, hours, or even your menu.
        </p>
      </>,
      <>
        <summary tabIndex="0" className={`fw600`}>
          How can I make my listing more visible?
        </summary>
        <p>
          Here is how you can make your listing more visible:
        </p>
        <ul>
          <li>
            Showcase Your Business: Feature high-quality photos of your location, products, services, and even smiling customers. Let potential customers visualize what awaits them.
          </li>
          <li>
            Craft a Compelling Narrative: Tell your story! Explain what makes your business unique and why customers should choose you over the competition. 
          </li>
          <li>
            Engage with Feedback: Actively respond to reviews, both positive and negative. Thank customers for their praise and address any concerns promptly.
          </li>
          <li>
            Maintain Accuracy: Ensure all information, including address, hours of operation, and contact details, is accurate and up-to-date. 
          </li>
        </ul>
      </>,
      <>
        <summary tabIndex="0" className={`fw600`}>
          I need help! Can someone guide me through creating a listing?
        </summary>
        <p>
          Justdial is here to help! If you have any questions, please don't hesitate to reach out to our dedicated customer service team at{" "}
          <b>
            <a href="tel:8888888888">88888 88888</a>
          </b>{" "}.
        </p>
      </>,
      <>
        <summary tabIndex="0" className={`fw600`}>
          How can I reach even MORE customers?
        </summary>
        <p>
          We offer premium plans that will increase your company's visibility and, in turn, attract more customers. You can learn more about premium plans here{" "}
          <b>
            <a href="https://www.justdial.com/advertise">www.justdial.com/advertise</a>
          </b>{" "}.
        </p>
      </>,
    ];

    return (
      <>
        {RenderComponentArr.slice(0, noOfQuestionToShow).map((faq_element, index) => {
          let id = index + 1;
          return (
            <div
              onClick={() => handleAccordian(id)}
              id={id}
              key={`faq_${id}`}
              className={`${styles.details} ${id === isActive ? `active` : ``}`}
            >
              {faq_element}
            </div>
          )
        })}
      </>
    );
  }
  return (
    <div id={`gotfaq`} className={`${styles.gotquestion} section`}>
      <h2 className={`color1a1`}>Got a question?</h2>
      <div className={`${styles.accordian} color111`}>{RenderComponent()}</div>
      {noOfQuestionToShow <= QUESTION_COUNT_ON_FIRST_LOAD ? (
        <div className={`${styles.questionbtn}`}>
          <button
            className={`primarybutton animationstop`}
            onClick={() => {
              setNoOfQuestionToShow(TOTAL_QUESTION_COUNT);
            }}
          >
            View More Questions
          </button>
        </div>
      ) : null}
    </div>
  );
}
