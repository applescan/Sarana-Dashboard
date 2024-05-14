"use client";

import { useState } from "react";
import { OrganizationList } from "@clerk/nextjs";
import { RiOrganizationChart } from "react-icons/ri";


const OrganizationProfilePage = () => {
    // State to control modal visibility
    const [isOpen, setIsOpen] = useState(false);

    // Toggle function to open and close the modal
    const toggleModal = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Button to open the modal */}
            <button
                onClick={toggleModal}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
                <RiOrganizationChart className="w-6 h-6"/>

            </button>

            {/* Modal Container */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={toggleModal} // Close the modal when clicking outside content
                >
                    <div
                        className="bg-white rounded-lg shadow-lg relative"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside content
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-2 right-2 bg-gray-100 rounded-full p-2 hover:bg-gray-200"
                            onClick={toggleModal}
                        >
                            &times;
                        </button>

                        <OrganizationList
                            afterCreateOrganizationUrl='/organization/:slug'
                            afterSelectOrganizationUrl='/organization/:slug'
                            hidePersonal={true}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default OrganizationProfilePage;

