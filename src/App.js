import React from "react";
import Header from "./components/Header";
import NewMessage from "./components/NewMessage";
import Sidebar from "./components/Sidebar";
function App() {
  return (
    <>
      <Header />
      <Sidebar />
      <NewMessage />
    </>
  );
}
export default App;
