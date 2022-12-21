import logo from './logo.svg';
import './App.css';
import Main from './component/main';
import ImportView from './component/import';

import React, {useEffect, useState} from "react";

function App() {
  const [showImportView,setShowImportView] = React.useState(true)
  const [mailGroups,setMailgroups] = React.useState()
  const [selectedMailGroups,setSelectedMailGroups] = React.useState(new Set())
  const [searchedMailGroup,setSearchedMailGroup] = React.useState("")

  return (
    <div className="App">
      {showImportView && (
      <ImportView
        showImportView={showImportView}
        setShowImportView={setShowImportView}
        mailGroups={mailGroups}
        setMailgroups={setMailgroups}
        selectedMailGroups={selectedMailGroups}
        setSelectedMailGroups={setSelectedMailGroups}
      />
      )}
      <Main
        showImportView={showImportView}
        setShowImportView={setShowImportView}
        mailGroups={mailGroups}
        setMailgroups={setMailgroups}
        selectedMailGroups={selectedMailGroups}
        setSelectedMailGroups={setSelectedMailGroups}
        searchedMailGroup={searchedMailGroup}
        setSearchedMailGroup={setSearchedMailGroup}
      />
    </div>
  );
}

export default App;
