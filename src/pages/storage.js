import React, { useEffect, useState } from "react";
import { account, database } from "../appwrite/config";
import { useNavigate } from "react-router-dom";
import { Query } from "appwrite";
import { storage } from "../appwrite/config";

const Storage = () => {
const navigate =useNavigate();
const [pic,setPic] = useState();
const [imgid,simd] = useState();
const handlesubmit = async(e)=>{
    e.preventDefault();
if(pic!=null){
    try {
        var x = await storage.createFile(process.env.REACT_APP_BUCKET_ID,
            "unique()",pic 
         );
         simd(x.$id);
         console.log(x);
    } catch (e) {
        console.log(e);
    }
}
}

const deleteimg = async () => {
    try {
        var x = await storage.deleteFile(process.env.REACT_APP_BUCKET_ID,imgid);
        console.log(x)
    } catch (e) {
        console.log(e);
    }
}

  return (
    <form onSubmit={handlesubmit}>
        <input type="file" name="file"required onChange={(e)=>{
            setPic(e.target.files[0]);
        }} ></input>
        <button type=" submit">upload</button>
        {imgid?<button onClick={deleteimg} >delete</button>:<></>}
        
    </form>
  );
};

export default Storage;
