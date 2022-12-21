import { Autocomplete, TextField } from "@mui/material";
import { useEffect,useState } from "react";

export default function SearchTextField({
    mailGroups,
    setMailgroups,
    selectedMailGroups,
    setSelectedMailGroups,
    searchedMailGroup,
    setSearchedMailGroup
}) {
    let options = mailGroups === undefined ? [] : Array.from(mailGroups.keys())
    useEffect(() => {
        console.log(mailGroups)
    },[mailGroups])

    if(mailGroups!==undefined){
        options = Array.from(mailGroups.keys())
    }
    return( 
        <Autocomplete
            options={options}
            renderInput={(params)=><TextField {...params} label="検索"/>}
            onChange={(event,value)=>{
                // let tmpSelectedMailGroups = new Set()
                // tmpSelectedMailGroups.add(value)
                // setSelectedMailGroups(tmpSelectedMailGroups)
                setSearchedMailGroup(value)
            }}
            onOpen={(event,value)=>{

            }}
            onClose={(event,value)=>{

            }}
        />
    )
}