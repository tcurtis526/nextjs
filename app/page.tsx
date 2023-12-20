"use client"
import Image from 'next/image'
import { useEffect, useState } from 'react';
import Fuse from 'fuse.js';

//We got a card Type
type Card = {
  ID?:string;
  Category?:string;
  Description?:string;
  Image?:string;
  Price?:number;
  Title?:string;
}
//And it's props
type CardProps = {
  card:Card;
}

//Function to display a "Card"
function Card({card}:CardProps){
  const [hover, setHover] = useState(false);
  const {ID, Category, Description, Image, Price, Title}=card;
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} 
    style={{borderRadius:5, border:"1px solid white", padding:20, margin:10, maxWidth:500, backgroundColor:(hover ? 'gray':'initial')}}>
      <div style={{fontSize:24, fontWeight:'bold'}}>
      {Title}
      </div>
      <br/>
      {Category}
      <br/>
      <div style={{fontSize:12,opacity:.6}}>
      {Description}
      </div>
      <br/>
      <img src={Image}></img>
      <div style={{fontSize:24, fontWeight:'bold'}}>${Price}</div>
      <br/>
    </div>
  )
}

export default function Home() {
  const [searchPattern, setSearchPattern] = useState("");
  const [data, setData] = useState<Card[]>([]); 
  const [results, setResults] = useState(data);
  const fuse = new Fuse(data, fuseOptions);
  useEffect(() => {
    const headers = { 'x-api-key': '085e119d-92ef-435e-8ba8-ae7b2e946d65' }
    // GET request using fetch inside useEffect React hook
    fetch('https://technical-interview-api.arthrex.io/products', {headers})
        .then(response => response.json())
        .then(data => setData(data));
  }, []);

  useEffect(() => {
    //using Fuse we can do fuzzy searches on the dataset.
    if(searchPattern != ""){
      const resultsBeforeMap = fuse.search(searchPattern)
      setResults(resultsBeforeMap.map(r => r.item));
    }
    //if the search patter is "" just setResults to data
    else{
      setResults(data);
    }
  }, [data, searchPattern]);
  return(
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flex: 1 }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div style={{fontSize:42, justifyContent:'center'}}>
          Welcome to the tool shop!
      </div>
      <input style={{color:'black', padding:5}} placeholder='Search' type='text' value={searchPattern} onChange={(e)=>setSearchPattern(e.target.value)}></input>
        {results.map(card => <Card card={card} />)}
      </div>
    </div>
  )
}


const fuseOptions = {
  // isCaseSensitive: false,
  // includeScore: false,
  // shouldSort: true,
  // includeMatches: false,
  // findAllMatches: false,
  // minMatchCharLength: 1,
  // location: 0,
  // threshold: 0.6,
  // distance: 100,
  // useExtendedSearch: false,
  // ignoreLocation: false,
  // ignoreFieldNorm: false,
  // fieldNormWeight: 1,
  keys: [
    "Title",
    "Description",
    "Category"
  ]
};