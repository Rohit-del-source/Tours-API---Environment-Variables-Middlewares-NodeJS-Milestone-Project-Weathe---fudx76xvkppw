const fs = require('fs');
const express = require('express');
const app = express();

//Middleware
app.use(express.json());

const tourDetails = JSON.parse(fs.readFileSync(`${__dirname}/data/tours.json`));

app.get('/tours', (req, res) => {
  //write a code here to get all the tours from tours.json
  try{
    res.status(200).json(tourDetails);
 }catch(err){
    res.status(500).json({"Error": err.message})
 }
});

app.post('/tours', (req, res) => {
  const { name, description, duration, price } = req.body;
  //Write a code here for creating new tour from data/tours.json
  //For creating new id use this logic
  // const newId = tourDetails[tourDetails.length - 1].id + 1;
  try{
    const newTour = {
     id : tourDetails[tourDetails.length - 1].id + 1,
     name,
     description,
     duration,
     price
    }
    tourDetails.push(newTour);
    fs.writeFileSync(`${__dirname}/data/tours.json`, JSON.stringify(tourDetails));
    res.status(200).json({"message": "Tour added successfully"});
 }catch(err){
   res.status(500).json({"Error": err.message});
 }
});

app.put('/tours/:id', (req, res) => {
  const tourId = parseInt(req.params.id);
  const updatedTour = req.body;

  //write a code here for updating a tour

  const isIdExist =  tourDetails.some((val)=> val.id === tourId);
    if(!updatedTour || !tourId || !isIdExist){
      return res.status(404).json({ message: 'Tour not found' });
    }
    let  index = tourDetails.findIndex((item)=> item.id === tourId);
    //replacing  old data with new data
    tourDetails[index]= {id:tourId, ...updatedTour};
    fs.writeFileSync(`${__dirname}/data/tours.json`, JSON.stringify(tourDetails));
    return res.status(200).json({"message": "Tour updated successfully"});
});

app.delete('/tours/:id', (req, res) => {
  const tourId = parseInt(req.params.id);
  //Write a code here for deleting a tour from data/tours.json
  const isIdExist =  tourDetails.some((val)=> val.id === tourId);
    if( !tourId || !isIdExist){
      return res.status(404).json({ message: 'Tour not found' });
    }
    const newData = tourDetails.filter(item=> item.id !== tourId);
    console.log('New Data: ', newData);
    fs.writeFileSync(`${__dirname}/data/tours.json`, JSON.stringify(newData));
    return res.status(200).json({"message": "Tour deleted successfully"});
});

module.exports = app;
