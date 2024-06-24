"use client";
import Header from "@/component/Header";
import { store } from "@/store";
import { Provider } from 'react-redux'

export default function Home() {
  return (
    <>
      <Provider store={store}>
        <Header />
      </Provider>
    </>
  );
}
