import Head from "next/head";
import "@/styles/globals.scss";
import Header from "../components/header";
import Footer from "../components/footer";
import { Provider } from "react-redux";
import store from "../store/store";
import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios";
import { sanitizeParams,IOS_CODE_ARR, fetchSourceCode, clickTracker, generateRandomToken } from "@/utils/commonFunc";
import LoginPopup from "@/components/loginpopup";

const App = ({ Component, pageProps, userprofile, sessionId}) => {
  const router = useRouter();
  const metaTagsNameObj = {
    'Title': 'Unlock Business Growth | Get Listed for FREE on Justdial',
    'description': `List your business for FREE with India’s leading local search engine, Justdial. Reach millions of potential customers, attract new clients, and provide valuable information to existing ones. Join instantly with a few clicks!`,
    'keywords': 'just dial free listing, just dial advertising, online business promotion, online advertising, free ads online, local business marketing, local business promotion',
  }
  const metaTagsPropertyObj = {
    'og:title': 'Unlock Business Growth | Get Listed for FREE on Justdial',
    'og:description': "List your business for FREE with India’s leading local search engine, Justdial. Reach millions of potential customers, attract new clients, and provide valuable information to existing ones. Join instantly with a few clicks!",
    'og:keywords': `just dial free listing, just dial advertising, online business promotion, online advertising, free ads online, local business marketing, local business promotion`,
    'og:url': 'https://www.justdial.com/Free-Listing',
    'og:site_name': 'Justdial',
  }
  const metaTagsHttp_equivObj = {
    'Content-type': 'text/html;charset=UTF-8'
  }
  const linkObj = {
    'canonical': "https://www.justdial.com/Free-Listing"
  };

  const title = 'Unlock Business Growth | Get Listed for FREE on Justdial';

  function replaceAllcustom(str, replace) {
    return this.replace(new RegExp(str, 'g'), replace)
  }
  if (!String.prototype?.replaceAll) {
    String.prototype.replaceAll = replaceAllcustom
  }

  const checkLogin = (source) => {
    let userProfile = null
    if (parseInt(source) == 3 && window?.JdLiteInterface) {
      var logjson = JdLiteInterface.getLoginData();
      if (logjson && logjson != '') {
        var logresponse = JSON.parse(logjson);
        userProfile = {
          sid: logresponse.sid,
          mobile: logresponse.mobile,
          source,
          version: logresponse.devicebuildversion,
          deviceId: logresponse.device_details.deviceid,
          status: statusRedux.success,
        }
      }
      userProfile = JSON.stringify(userProfile).toString()
      userProfile = encodeURI(userProfile)
      document.cookie = `userProfile = ${userProfile}`
      return;
    } else if (parseInt(source) == 3) {
    }
  }
  
  const ClickTrackerReferer = (li, ll) => {
    try{
      let sourceCode = sanitizeParams(router?.query?.source) || null;
      let deviceUserAgent = navigator.userAgent;
      sourceCode = fetchSourceCode(sourceCode, deviceUserAgent);

      clickTracker({
        sourceCode: sourceCode,
        li: li,
        ll: 'freelisting',
      });
    } catch (error){
    }
  };

  function checkIsFromSEO(){
    if(typeof window !== "undefined") {
      let refererURL = window?.frames?.top?.document?.referrer || document?.referrer;
      return refererURL?.length && !refererURL?.includes('.justdial.com');
    }
    return false;
  }

  function trackSEOTraffic () {	
    let isfromSEO = checkIsFromSEO();
    if (isfromSEO) {
      ClickTrackerReferer("freelisting_indirect", "freelisting");
    }
  }

  useEffect(() => {
    if (sanitizeParams(router?.query?.source) == '1' || sanitizeParams(router?.query?.source) == '3') {
      checkLogin(sanitizeParams(router?.query?.source))
    }
    trackSEOTraffic()
    if(!window?.userToken){
      window.userToken = generateRandomToken()
    }

  }, [])
  

  

  useEffect(() => {
    //click tracker implementaion
    const sourceCode = sanitizeParams(router?.query?.source) || '77';
    if(IOS_CODE_ARR.includes(sourceCode)){
      window?.webkit?.messageHandlers?.callbackHandler?.postMessage(JSON.stringify({ "type": "hideAppheader" }));
    }
  }, []);

  axios.interceptors.request.use(function (config) {
    if (config.url.startsWith("/api") || config.url.startsWith("api")) {
      let baseurl =
        location.host && location.host.match(/\.jdsoftware\.jd/)
          ? "http://project01.anilkumar.jdsoftware.jd"
          : "";
      let port = location?.port?.length ? ":" + location?.port : "";
      config.baseURL = baseurl + port + "/Free-Listing"; //process.env.basePath;
    }
    config.timeout = 30000;
    return config;
  });

  return (
    <>
      <Provider store={store}>
        <Head>
          <title>{`${title}`}</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
          />
          {metaTagsNameObj &&
            Object.entries(metaTagsNameObj).map((entry, key) => 
              <meta name={entry[0]} key={'a'+key} content={entry[1]} />
            )
          }
          {metaTagsPropertyObj &&
            Object.entries(metaTagsPropertyObj).map((entry, key) => (
              <meta property={entry[0]} key={'b'+key} content={entry[1]} />
            ))
          }
          {metaTagsHttp_equivObj &&
            Object.entries(metaTagsHttp_equivObj).map((entry, key) => (
              <meta http-equiv={entry[0]} key={'c'+key} content={entry[1]} />
            ))
          }
          {linkObj &&
            Object.entries(linkObj).map((entry, key) => (
              <link rel={entry[0]} key={'d'+key} href={entry[1]} />
            ))
          }

          {
            (router?.pathname == '/' || router?.pathname == '/successStories') &&
            <script type="application/ld+json" dangerouslySetInnerHTML={{__html:`
            {
              "@context": "https://schema.org",
                  "@type": "Organization",
                      "name": "Justdial",
                          "alternateName": "Just Dial",
                              "url": "https://www.justdial.com/Free-Listing",
                                  "description": "List your business for FREE with Indiaâ€™s leading local search engine, Justdial. Reach millions of potential customers, attract new clients, and provide valuable information to existing ones. Join instantly with a few clicks!",
                                      "logo": "https://akam.cdn.jdmagicbox.com/images/icontent/jdrwd/jdlogosvg.svg",
                                          "contactPoint": {
                  "@type": "ContactPoint",
                      "contactType": "customer support",
                          "telephone": "88888-88888 (DEMO)",
                              "email": "customerservice@justdial.com"
              },
              "sameAs": [
                  "https://www.facebook.com/JustDial",
                  "https://twitter.com/jd_justdial",
                  "https://www.instagram.com/jd_justdial/",
                  "https://www.youtube.com/user/justdialind",
                  "https://www.linkedin.com/company/justdial/"
              ]
          }`
            }}/>
          }

          {
            (router?.pathname == '/') &&
            <>
              <script type="application/ld+json" dangerouslySetInnerHTML={{__html:`
              {
                "@context": "https://schema.org/", 
                "@type": "BreadcrumbList", 
                "itemListElement": [{
                  "@type": "ListItem", 
                  "position": 1, 
                  "name": "Justdial",
                  "item": "https://www.justdial.com/"  
                },{
                  "@type": "ListItem", 
                  "position": 2, 
                  "name": "Free Business Listing",
                  "item": "https://www.justdial.com/Free-Listing"  
                }]
              }`
              }}/>
               <script type="application/ld+json" dangerouslySetInnerHTML={{__html:`
             {
              "@context": "https://schema.org",
                  "@type": "FAQPage",
                      "mainEntity": [{
                          "@type": "Question",
                          "name": "What are the benefits of listing a business on Justdial?",
                          "acceptedAnswer": {
                              "@type": "Answer",
                              "text": "Justdial is India's No. 1 local search platform and provides a range of benefits for businesses listed on the platform such as
                    1. Boost your online presence and get more customers - Justdial has a customer base of 17+ crore.Listing your business will help you reach out to these users when your business listing or your business category is searched on Justdial.
                    2. Create an online catalogue to showcase your ready- to - buy products or services for prospective clients seeking for more detailed information.
                    3. Build Trust - Having an online presence on Justdial will help you build trust with customers and engage with them via reply to reviews and questions.
                    4. Publish Deals, Menu, Rate Card, Brochure, etc to inform your potential customers about your business offerings."
          }
              }, {
              "@type": "Question",
                  "name": "Can I list my business for FREE on Justdial?",
                      "acceptedAnswer": {
                  "@type": "Answer",
                      "text": "Totally! Just add your phone number, address, and business type – it's super easy!"
              }
          }, {
              "@type": "Question",
                  "name": "I already have a website and social media. Do I still need Justdial?",
                      "acceptedAnswer": {
                  "@type": "Answer",
                      "text": "Yes, your free business listing complements your website and social media presence. Adding your website and social media handles to your Justdial profile will make your site more visible to customers searching for your business listing or category."
              }
          }, {
              "@type": "Question",
                  "name": "Do I need to download the Jd App to create and manage my business listing?",
                      "acceptedAnswer": {
                  "@type": "Answer",
                      "text": "You are not required to download the Justdial app to create or manage your listing. Both our website and mobile browser offer user-friendly interfaces for this purpose. However, the app provides additional features, such as competitor tracking, which can be a valuable tool for optimizing your online presence."
              }
          }, {
              "@type": "Question",
                  "name": "How do I pick the right categories for my business?",
                      "acceptedAnswer": {
                  "@type": "Answer",
                      "text": "Think about how your target audience would search for your business. If you operate a gym, selecting categories like Fitness Center Services or Wellness and Physical Activity Facilities will help potential customers find you when they're online. The more accurate and targeted your chosen categories, the higher your visibility becomes."
              }
          }, {
              "@type": "Question",
                  "name": "How do I add my Whatsapp number to my business profile?",
                      "acceptedAnswer": {
                  "@type": "Answer",
                      "text": "In the free listing form, you have the option to add your WhatsApp number. You can also update your contact information via the 'My Business' section on Justdial."
              }
          }, {
              "@type": "Question",
                  "name": "Can I change my listing information after I create it?",
                      "acceptedAnswer": {
                  "@type": "Answer",
                      "text": "Absolutely! Just go to the My Business section on Justdial and update details like your phone number, address, hours, or even your menu."
              }
          }, {
              "@type": "Question",
                  "name": "How can I make my listing more visible?",
                      "acceptedAnswer": {
                  "@type": "Answer",
                      "text": "Here is how you can make your listing more visible:
                  1. Showcase Your Business: Feature high - quality photos of your location, products, services, and even smiling customers.Let potential customers visualize what awaits them.
                    2. Craft a Compelling Narrative: Tell your story! Explain what makes your business unique and why customers should choose you over the competition. 
                    3. Engage with Feedback: Actively respond to reviews, both positive and negative.Thank customers for their praise and address any concerns promptly.
                    4. Maintain Accuracy: Ensure all information, including address, hours of operation, and contact details, is accurate and up - to - date."
              }
          }, {
              "@type": "Question",
                  "name": "I need help! Can someone guide me through creating a listing?",
                      "acceptedAnswer": {
                  "@type": "Answer",
                      "text": "Justdial is here to help! If you have any questions, please don't hesitate to reach out to our dedicated customer service team at 8888888888"
              }
          }, {
              "@type": "Question",
                  "name": "How can I reach even MORE customers?",
                      "acceptedAnswer": {
                  "@type": "Answer",
                      "text": "We offer premium plans that will increase your company's visibility and, in turn, attract more customers. You can learn more about premium plans here www.justdial.com/advertise"
              }
          }]
            }`
              }}/>
            </>
          }
            
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="container">
          <div className="container__page">
            <Header />
            <Component {...pageProps} />
            <LoginPopup />
            {router.route !== "/" && router.route !== "/otp" ? (
              <Footer />) : null}
          </div>
        </main>
      </Provider>
    </>
  );
};

App.getInitialProps = async ({ctx}) => {
  if (typeof window == "undefined") {
    if (ctx?.req?.url == '/health-check') {
      try {
        const fs = require('fs')
        const path = require('path')
        const __dirname = path.resolve();
        const fileContent = fs.readFileSync(path.join(__dirname, '/', './LoadBalancer_HealthCheck.txt'), 'utf-8')
        ctx.res.writeHead(200);
        ctx.res.end(fileContent)
      } catch (e) {
        console.log("health-check", e)
        ctx.res.writeHead(404);
        ctx.res.end('404');
      }
      return {}
    }
  }
  return {
    props: {},
  };
}

export default App;
