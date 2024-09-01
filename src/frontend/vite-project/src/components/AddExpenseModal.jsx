
import { useState, useEffect } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { PhotoIcon } from '@heroicons/react/24/solid'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function AddExpenseModal(){
  const navigate = useNavigate();
  const [open, setOpen] = useState(true)
  const [ticketFile, setTicketFile] = useState(null);


  const handleAddExpense = () => {
    navigate('/form-expense', { state: { transaction_id: "" } });
  };

  const handleUploadImage = async () => {
    const file = ticketFile;
    if (!file) {
        console.error("No file selected.");
        return;
    }

    const formData = new FormData();
    formData.append("file", file); // "file" es el nombre del campo esperado por el servidor

    try {
        const response = await axios.post("http://localhost:8000/extract_text", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        if (response.status === 200) {
            console.log("Image uploaded successfully:", response.data);
            navigate('/form-expense-ocr', { state: { ticket_data: response.data } });
        } else {
            console.error("Failed to upload image:", response.statusText);
        }
    } catch (error) {
        console.error("Error uploading image:", error);
    }
    };
  
  const [showUploadImage, setShowUploadImage] = useState(false);

    const handleShowUploadImage = () => {
        setShowUploadImage(true);
    };

    const uploadTicket = ticket => {
        setTicketFile(ticket); 
    };

    useEffect(() => {
        if (ticketFile) {
          handleUploadImage();
        }
      }, [ticketFile]);
    

return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <DialogPanel
                    transition
                    className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                >
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                    Añadir gasto
                                </DialogTitle>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                            ¿Cómo quieres añadir el gasto?
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                            type="button"
                            data-autofocus
                            onClick={() => {
                                setOpen(false);
                                handleAddExpense();
                            }}
                            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                        >
                            Escanear ticket
                        </button>
                        <button
                            type="button"
                            data-autofocus
                            onClick={() => {
                                // setOpen(false);
                                handleShowUploadImage();
                            }}
                            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                        >
                            Subir ticket
                        </button>
                        <button
                            type="button"
                            data-autofocus
                            onClick={() => {
                                setOpen(false);
                                handleAddExpense();
                            }}
                            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                        >
                            Manual
                        </button>
                    </div>
                    { showUploadImage && (
                    <>
                    <div className="col-span-full bg-gray-50">
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                            <div className="text-center">
                            <PhotoIcon aria-hidden="true" className="mx-auto h-12 w-12 text-gray-300" />
                            <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                >
                                <span>Subir archivo</span>
                                <input 
                                    id="file-upload" 
                                    name="file-upload" 
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer border-gray-300 rounded-md" 
                                    onChange={(e) => uploadTicket(e.target.files[0])} 
                                />
                                </label>                                
                            </div>
                            <p className="text-xs leading-5 text-gray-600">PNG, JPG o PDF</p>
                            </div>
                        </div>
                    </div>
                    </>
                    )}

                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                            type="button"
                            data-autofocus
                            onClick={() => setOpen(false)}
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        >
                            Cancel
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </div>
    </Dialog>
)
}