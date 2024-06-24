const { render } = require("@testing-library/react")
import { Provider } from "react-redux"
import Header from "../Header"
import React from 'react'
import { store } from "../../store"

test("logo should load on rendering header", () => {
    // load header
    let header = render(
        <Provider store={store}>
            <Header />
        </Provider>
    )

    // console.log(header, "yogesh")// this is the virtual dom object
    let logo = header.getByTestId('header_list_1')
    console.log(logo,"logo");

    // 
})