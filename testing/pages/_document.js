import { Html, Head, Main, NextScript } from 'next/document'
import React, { useEffect } from "react";

export default function Document() {
  let isGA = process.env.NODE_ENV!='development';
  return (
    <Html lang="en"> 
      <Head>
{isGA?    <script
              dangerouslySetInnerHTML={{
                __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push(

                  {'gtm.start': new Date().getTime(),event:'gtm.js'}
                  );var f=d.getElementsByTagName(s)[0],
                  
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  
                  })(window,document,'script','dataLayer','GTM-W2JD7JC');
                `,
              }}
            />:<script/>}
      </Head>
      <body>
    

      {isGA?  <noscript dangerouslySetInnerHTML={{ __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${'GTM-W2JD7JC'}"
		height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
		}}
	/>:null}
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
