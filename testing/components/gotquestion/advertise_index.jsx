import React from "react";
import styles from "./gotquestion.module.scss";

export default function Gotquestion() {
    return(
        <div id={`gotfaq`} className={`${styles.gotquestion} section`}>
            <h2 className={`color1a1`}>Got a question?</h2>
            <div className={`${styles.accordian} color111`}>
                <details>
                    <summary className={`fw500`}>Is Listing your Business on Justdial free?</summary>
                    <p>Epcot is a theme park at Walt Disney World Resort featuring exciting attractions, international pavilions, award-winning fireworks and seasonal special events.</p>
                </details>
                <details>
                    <summary className={`fw500`}>Do I need to download an app to create and manage my business listing?</summary>
                    <p>Epcot is a theme park at Walt Disney World Resort featuring exciting attractions, international pavilions, award-winning fireworks and seasonal special events.</p>
                </details>
                <details>
                    <summary className={`fw500`}>Should I create a Business Listing if I already have a website or social media presence?</summary>
                    <p>Epcot is a theme park at Walt Disney World Resort featuring exciting attractions, international pavilions, award-winning fireworks and seasonal special events.</p>
                </details>
                <details>
                    <summary className={`fw500`}>How do I add details to my Justdial business listing page?</summary>
                    <p>Epcot is a theme park at Walt Disney World Resort featuring exciting attractions, international pavilions, award-winning fireworks and seasonal special events.</p>
                </details>
            </div>
            <div className={`${styles.questionbtn}`}>
                <button className={`primarybutton`}>View more</button>
            </div>
        </div>
    )
}