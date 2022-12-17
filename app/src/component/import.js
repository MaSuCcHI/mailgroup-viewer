import React, {useCallback, useEffect} from 'react'
import Modal from "react-modal"
import { Button } from "@mui/material";
import Papa from "papaparse"

export default function ImportView({
    showImportView,
    setShowImportView,
    mailGroups,
    setMailgroups
}){
    Modal.setAppElement(document.getElementById('root'))

    const parseMailGroups = (rawData) => {
        // console.log(rawData)
        const tmpMailGroups = new Map()
        rawData.forEach((elem,index)=> {
            if(index===0){return}
            // console.log(elem) 
            const targetMailgroup = elem[0]
            const childMail = elem[1]
            
            if (!tmpMailGroups.has(targetMailgroup)){
                const parents = []
                const children = []
                tmpMailGroups.set(targetMailgroup,{"parents":parents,"children":children})
            }
            const children = tmpMailGroups.get(targetMailgroup).children
            children.push(childMail)
            
            if(!tmpMailGroups.has(childMail)){
                const parents = [] 
                const children = []
                tmpMailGroups.set(childMail,{"parents":parents,"children":children})
            }
            const parents = tmpMailGroups.get(childMail).parents
            parents.push(targetMailgroup)
        });
        // console.log(tmpMailGroups)
        return tmpMailGroups
    }

    const onChangeFile = (event) => {
        const file = event.target.files[0]
        console.log(file)
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onload = () => {
            const result = Papa.parse(reader.result)
            const mailGroups = parseMailGroups(result.data)
            setMailgroups(mailGroups)
        }
    }
    
    return(
    <Modal isOpen={showImportView}>
        <input
            name='file'
            type='file'
            onChange={onChangeFile}
        />
        <Button
            onClick = { () => {setShowImportView(false)} }
        >
            閉じる
        </Button>
    </Modal>
    )
}