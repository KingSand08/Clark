import { useState, useEffect } from 'react';
import { getAllDesserts, createDessert, deleteDessert, editDessert } from '../../APIFunctions/Desserts';

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

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editRating, setEditRating] = useState('');

  const startEditing = (dessert) => {
    setEditingId(dessert._id);
    setEditTitle(dessert.title);
    setEditDescription(dessert.description || '');
    setEditRating(dessert.rating || '');
  };

  async function getDessertsFromDB() {
    const dessertsFromDB = await getAllDesserts();
    if (!dessertsFromDB.error) {
      setDesserts(dessertsFromDB.responseData);
    }
  }

  useEffect(() => {
    getDessertsFromDB();
  }, []);

  const INPUT_CLASS = 'px-3 py-2 rounded-md bg-none border border-stone-500 w-70';


  useEffect(() => {
    getDessertsFromDB();
  }, []);

  return (
    <>
      <div className='mx-10'>
        <h1
          className="text-5xl leading-none tracking-tight text-gray-900 md:text-5xl lg:text-5xl dark:text-white py-20">
          Dessert Admin Page
        </h1>

        <div className='flex flex-row gap-10'>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className={INPUT_CLASS}
            required
          />
          <input
            type="text"
            name="description"
            id="description"
            placeholder="Desc."
            value={description}
            onChange={e => setDescription(e.target.value)}
            className={INPUT_CLASS}
          />
          <input
            type="number"
            name="rating"
            id="description"
            placeholder="Rating"
            value={rating}
            onChange={e => setRating(e.target.value)}
            className={INPUT_CLASS}
          />
          <button
            type="submit"
            className="ml-20 rounded-md bg-[#A1A6AA] hover:bg-[#878c90] focus-visible:outline-[#8e9499] dark:bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm dark:hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 dark:focus-visible:outline-indigo-600"
            onClick={async () => {
              if (title === undefined) {
                alert('Title should be filled out before submitting a dessert');
                return;
              }
              const ratingUsed = rating != 0 ? rating : undefined;

              const result = createDessert({
                title,
                description,
                ratingUsed,
              }, props.user.token);

              if (!result.error) {
                setTitle('');
                setDescription('');
                setRating('');

                setTimeout(async () => getDessertsFromDB(), 10);
              } else {
                alert('Failed to add dessert.');
              }
            }}
          >
            Submit
          </button>
        </div>

        {desserts.length != 0 ?
          <div className="relative overflow-x-auto mt-10">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <tbody>
                {desserts.map((dessert) => {
                  const isEditing = editingId === dessert._id;

                  return (
                    isEditing ? (
                      <tr key={dessert._id} className="border border-stone-700">
                        <td className="flex flex-col gap-2 px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          <input
                            type="text"
                            name="title"
                            id="title"
                            placeholder="Title"
                            value={editTitle}
                            onChange={e => setEditTitle(e.target.value)}
                            className={INPUT_CLASS}
                            required
                          />
                          <input
                            type="text"
                            name="description"
                            id="description"
                            placeholder="Desc."
                            value={editDescription}
                            onChange={e => setEditDescription(e.target.value)}
                            className={INPUT_CLASS}
                          />
                          <input
                            type="number"
                            name="rating"
                            id="description"
                            placeholder="Rating"
                            value={editRating}
                            onChange={e => setEditRating(e.target.value)}
                            className={INPUT_CLASS}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <button
                            type="submit"
                            className="ml-20 rounded-md bg-[#A1A6AA] hover:bg-[#878c90] focus-visible:outline-[#8e9499] dark:bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm dark:hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 dark:focus-visible:outline-indigo-600"
                            onClick={async () => {
                              if (editTitle === undefined) {
                                alert('Title should be filled out before submitting a dessert');
                                return;
                              }
                              const editRatingUsed = editRating != 0 ? editRating : undefined;

                              const result = editDessert({
                                _id: dessert._id,
                                title: editTitle,
                                description: editDescription,
                                rating: editRatingUsed,
                              }, props.user.token);

                              if (!result.error) {
                                setEditingId(null);
                                setEditTitle('');
                                setEditDescription('');
                                setEditRating('');

                                setTimeout(async () => getDessertsFromDB(), 50);
                              } else {
                                alert('Failed to edit dessert.');
                              }
                            }}
                          >
                            save
                          </button>
                        </td>
                      </tr> ) : (
                      <tr key={dessert._id} className="border border-stone-700">
                        <td className="flex flex-col gap-2 px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          <h2 className='font-semibold md:text-2xl lg:text-4xl'>{dessert.title}</h2>
                          <p className='font-normal md:text-lg lg:text-xl text-[#8781AB]'>{dessert.description}</p>
                          {dessert.rating &&
                            <p className='font-normal md:text-lg lg:text-xl text-[#8781AB]'>Rating: {dessert.rating}</p>}
                        </td>

                        <td className="px-6 py-4">
                          <div className='flex flex-col w-fit gap-4'>
                            <button className='bg-[#CB444B] rounded-md focus-visible:outline-[#8e9499] px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                              onClick={ async () => {
                                const result = await deleteDessert({
                                  _id: dessert._id,
                                }, props.user.token);

                                if (!result.error) {
                                  setTimeout(async () => getDessertsFromDB(), 10);
                                } else {
                                  alert('Failed to delete dessert.');
                                }
                              }}
                            >
                              Delete
                            </button>
                            <button className='bg-[#4AA0B5] rounded-md focus-visible:outline-[#8e9499] px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                              onClick={() => startEditing(dessert)}>
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  );
                })}
              </tbody>
            </table>
          </div> :
          <div>
            <h2 className='pt-6 text-center text-3xl'>No desserts yet!</h2>
          </div>
        }
      </div>
    </>
  );
}
