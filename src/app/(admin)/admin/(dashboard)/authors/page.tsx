"use client";

import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPen,
  faTrash,
  faSearch,
  faSpinner,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import {
  getBooks,
  createBook,
  deleteBook,
  uploadMedia,
  type Book,
  ApiError,
} from "@/lib/api-client";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
interface Author {
  id: string;
  name: string;
  bio: string;
  nationality: string;
  birthDate: string;
  photoUrl: string;
  email: string;
  books: string[];
}

const authors: Author[] = [
  {
    id: "1",
    name: "George Orwell",
    bio: "English novelist known for his sharp critique of totalitarianism.",
    nationality: "British",
    birthDate: "1903-06-25",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7e/George_Orwell_press_photo.jpg",
    email: "george.orwell@example.com",
    books: ["1984", "Animal Farm", "Homage to Catalonia", "Keep the Aspidistra Flying"],
  },
  {
    id: "2",
    name: "J.K. Rowling",
    bio: "British author best known for the Harry Potter fantasy series.",
    nationality: "British",
    birthDate: "1965-07-31",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5d/J._K._Rowling_2010.jpg",
    email: "jk.rowling@example.com",
    books: ["Harry Potter and the Philosopher's Stone", "Harry Potter and the Chamber of Secrets", "The Casual Vacancy", "The Ickabog"],
  },
  {
    id: "3",
    name: "Haruki Murakami",
    bio: "Japanese writer whose works have garnered a large international following.",
    nationality: "Japanese",
    birthDate: "1949-01-12",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/80/Murakami_Haruki_%282009%29.jpg",
    email: "h.murakami@example.com",
    books: ["Norwegian Wood", "Kafka on the Shore", "1Q84", "The Wind-Up Bird Chronicle"],
  },
  {
    id: "4",
    name: "Toni Morrison",
    bio: "American novelist and first African-American woman to receive the Nobel Prize in Literature.",
    nationality: "American",
    birthDate: "1931-02-18",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/04/Toni_Morrison_2008-2.jpg",
    email: "toni.morrison@example.com",
    books: ["Beloved", "Song of Solomon", "The Bluest Eye", "Sula"],
  },
  {
    id: "5",
    name: "Gabriel García Márquez",
    bio: "Colombian novelist and Nobel Prize laureate, pioneer of magical realism.",
    nationality: "Colombian",
    birthDate: "1927-03-06",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Gabriel_Garcia_Marquez.jpg",
    email: "gg.marquez@example.com",
    books: ["One Hundred Years of Solitude", "Love in the Time of Cholera", "The General in His Labyrinth", "Chronicle of a Death Foretold"],
  },
]

export default function AuthorsPage(){
  const [searchTerm, setSearchTerm] = useState("");
    
    return <div className="space-y-6">
        <div className=" flex items-center justify-between">
            <div>
            <h2 className="text-2xl font-bold text-gray-800">Edit Authors</h2>
             <p className="text-gray-500 mt-1">Manage your authors</p>
             </div>
            <button className="flex items-center bg-blue-600 text-white gap-2 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
          Add New Author    
            </button>
        </div>
        {/*Search Bar*/}
        
        <div className="bg-white rounded-lg shadow p-4">
           <div className="relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search Authors...." value={searchTerm} onChange={(e)=>{
                setSearchTerm(e.target.value);
            }} 
            className=" w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-111111"/>
           </div>
        </div>
        {/*Authors Table*/}
        <div>
            <table className ="w-full">
                <thead className="bg-gray-50">
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Bio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Books
                </th>
              
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {
                        authors.map((author)=>{
                           return (
                            <tr key ={author.id} className="hover:bg-gray-50">
                                <td className="px-6 pb-2 pt-4 text-black">
                                   <div className="flex flex-col gap-2 ">
                                    <img src={author.photoUrl} className="w-14 h-18 object-cover rounded"/>
                                     <h6>{author.name}</h6>
                                   </div>
                                </td>
                                 <td>
                                <p className="text-gray-800">{author.bio}</p>
                            </td>
                              <td>
                                <p className="text-gray-800"> {author.books.slice(0, -1).join(', ') + 
   (author.books.length > 1 ? ' and ' : '') + 
   author.books.slice(-1)}</p>
                            </td>
                             <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <FontAwesomeIcon icon={faPen} className="w-4 h-4" />
                        </button>
                        <button
                          
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {1==1 ? (
                            <FontAwesomeIcon
                              icon={faSpinner}
                              className="w-4 h-4 animate-spin"
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="w-4 h-4"
                            />
                          )}
                        </button>
                      </div>
                    </td>
                            </tr>
                           
                           ) 
                        })
                    }
                </tbody>
            </table>
        </div>


    </div>
}