import React, { useState, useEffect } from 'react';
import { getAllDesserts, createDessert } from '../../APIFunctions/Desserts';

export default function DessertPage(props) {
  const [desserts, setDesserts] = useState([]);
  async function getDessertsFromDB() {
    const dessertsFromDB = await getAllDesserts();
    if (!dessertsFromDB.error) {
      setDesserts(dessertsFromDB.responseData);
    }
  }
  const [description, setDescription] = useState();
  const [title, setTitle] = useState();
  const [rating, setRating] = useState();

  async function getDessertsFromDB() {
    const dessertsFromDB = await getAllDesserts();
    if (!dessertsFromDB.error) {
      setDesserts(dessertsFromDB.responseData);
    }
  }

  useEffect(() => {
    getDessertsFromDB();
  }, []);

  const INPUT_CLASS = 'indent-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-white';


  useEffect(() => {
    getDessertsFromDB();
  }, []);

  return (
    <div className=''>
      <h1
        className="bg-center bg-cover bg-[url(https://imgcdn.stablediffusionweb.com/2024/9/9/41e2f8c9-f7db-4697-b11a-96f38effafdf.jpg)] text-center text-5xl leading-none tracking-tight text-gray-900 md:text-5xl lg:text-5xl dark:text-white py-20">
        Desserts
      </h1>


      <div className='m-10'>
        <div className="relative overflow-x-auto mt-10">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <tbody>
              {desserts.map((dessert) => {
                return (
                  <tr key={dessert._id} className="">
                    <th scope="row" className="flex flex-col gap-2 border border-stone-700 px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <h2 className='font-semibold md:text-2xl lg:text-4xl'>{dessert.title}</h2>
                      <p className='font-normal md:text-lg lg:text-xl text-[#8781AB]'>{dessert.description}</p>
                      {dessert.rating &&
                        <p className='font-normal md:text-lg lg:text-xl text-[#8781AB]'>Rating: {dessert.rating}</p>}
                    </th>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
