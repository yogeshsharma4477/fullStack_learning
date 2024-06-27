import styles from './breadcrum.module.scss'
export default function Breadcrum(){
    return (
        <ul className={`${styles.breadcrum} section`}>
           <li>
                <a onClick={()=>{window.location.href=`https://www.justdial.com`}}>Home</a>
            </li>
            <li>
                <span>Free Business Listing</span>
            </li>
        </ul>
    )
}
