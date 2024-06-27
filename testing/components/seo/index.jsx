import styles from './seo.module.scss'
export default function Seo() {
    return (
        <div className={`${styles.seo} section`}>
            <div className={`${styles.seo__box} mb-30`}>
                <div className={`color111 font12 mb-15`}>List Your Business for FREE on Justdial: India’s Leading Local Search Engine</div>
                <p className={`color555 font12 m-0`}>Are you a business owner seeking to expand your reach and attract more customers? Justdial, India’s leading local search engine, offers an incredible opportunity to list your business for free and boost your online visibility. Whether you’re a startup, an SMB, or an established enterprise, listing your business on Justdial can increase your reach and drive valuable leads.</p>
            </div>
            <div className={`${styles.seo__box} mb-30`}>
                <div className={`color333 font12 mb-15`}>Why List Your Business on Justdial?</div>
                <ul>
                    <li className={`color555 font12 fw300`}>Massive Audience : Justdial connects millions of users with local businesses daily.</li>
                    <li className={`color555 font12 fw300`}>24/7 Virtual Storefront : Increase accessibility to your products or services.</li>
                    <li className={`color555 font12 fw300`}>Enhanced Credibility : Build trust with potential customers.</li>
                    <li className={`color555 font12 fw300`}>Targeted Lead Generation : Attract users actively searching for your offerings.</li>
                </ul>
            </div>
            <div className={`${styles.seo__box} mb-30`}>
                <div className={`color333 font12 mb-15`}>Why List Your Business on Justdial?</div>
                <ul>
                    <li className={`color555 font12 fw300`}>Visit the Justdial Free Listing Page :&nbsp;<a className={`color007`} onClick={()=>{window.location.href=`https://www.justdial.com`}}>https://www.justdial.com/</a></li>
                    <li className={`color555 font12 fw300`}>Click “Start Now” : Begin the registration process.</li>
                    <li className={`color555 font12 fw300`}>Provide Business Details : Name, address, contact, category, etc.</li>
                    <li className={`color555 font12 fw300`}>OTP Verification : Ensure a secure and verified listing.</li>
                </ul>
            </div>
            <div className={`${styles.seo__box} mb-30`}>
                <div className={`color333 font12 mb-15`}>Benefits of Justdial’s Free Listing</div>
                <ul>
                    <li className={`color555 font12 fw300`}>Increased Online Visibility</li>
                    <li className={`color555 font12 fw300`}>Boosted Credibility</li>
                    <li className={`color555 font12 fw300`}>Direct Lead Generation</li>
                    <li className={`color555 font12 fw300`}>Nationwide Reach</li>
                    <li className={`color555 font12 fw300`}>Keyword Optimization</li>
                    <li className={`color555 font12 fw300`}>Potential for Business Growth</li>
                </ul>
            </div>
            <div className={`${styles.seo__box} mb-30`}>
                <div className={`color333 font12 mb-15`}>Additional Tips for SEO Optimization</div>
                <ul>
 <li className={`color555 font12 fw300`}>Local Keywords : Target terms like “[your city's name] + [service your provide]”.</li>
                                        <li className={`color555 font12 fw300`}>Business Reviews : Encourage positive reviews for social proof.</li>
                    <li className={`color555 font12 fw300`}>Featured Listings & Ads : Consider Justdial’s paid options for even more prominence.</li>
                </ul>
            </div>
            <p className={`color333 font12 m-0`}>Create your FREE Justdial business profile today and unlock new growth opportunities!</p>
        </div>
    )
}
