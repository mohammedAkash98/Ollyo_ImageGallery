import React, { useState } from "react";
import "./App.css";
import Modal from "react-modal";

const App = () => {
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedImagesToDelete, setSelectedImagesToDelete] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

    const onSelectFile = (event) => {
        const selectedFiles = event.target.files;
        const selectedFilesArray = Array.from(selectedFiles);

        const imagesArray = selectedFilesArray.map((file) => {
            return { url: URL.createObjectURL(file), file: file, isSelected: false };
        });

        setSelectedImages((previousImages) => previousImages.concat(imagesArray));

        // For the bug in Chrome
        event.target.value = "";
    };

    function deleteHandler(image) {
        setSelectedImages((previousImages) =>
            previousImages.filter((e) => e !== image)
        );
        setSelectedImagesToDelete((prev) =>
            prev.filter((selectedImage) => selectedImage !== image)
        );
        URL.revokeObjectURL(image.url);
    }

    const deleteSelectedImages = () => {
        const imagesToDelete = selectedImages.filter((image) => image.isSelected);

        imagesToDelete.forEach((image) => {
            URL.revokeObjectURL(image.url);
        });

        setSelectedImages(selectedImages.filter((image) => !image.isSelected));
        setSelectedImagesToDelete([]);
    };

    const toggleImageSelection = (image) => {
        image.isSelected = !image.isSelected;
        setSelectedImages([...selectedImages]);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImageIndex(null);
    };

    const startSlideshow = () => {
        if (selectedImages.length > 0) {
            setSelectedImageIndex(0);
            openModal();
        }
    };

    const nextSlide = () => {
        if (selectedImageIndex !== null && selectedImageIndex < selectedImages.length - 1) {
            setSelectedImageIndex(selectedImageIndex + 1);
        }
    };

    const previousSlide = () => {
        if (selectedImageIndex !== null && selectedImageIndex > 0) {
            setSelectedImageIndex(selectedImageIndex - 1);
        }
    };

    return ( <
        section >
        <
        label >
        +Add Images <
        br / >
        <
        span > Upload < /span> <
        input type = "file"
        name = "images"
        onChange = { onSelectFile }
        multiple accept = "image/png, image/jpeg, image/webp" / >
        <
        /label> <
        br / >

        {
            selectedImages.length > 0 && ( <
                div > {
                    selectedImages.some((image) => image.isSelected) && ( <
                        div >
                        <
                        button className = "delete-selected-btn"
                        onClick = { deleteSelectedImages } >
                        Delete Selected <
                        /button> <
                        button className = "slideshow-btn"
                        onClick = { startSlideshow } >
                        Slideshow <
                        /button> < /
                        div >
                    )
                } <
                /div>
            )
        }

        <
        div className = "images" > {
            selectedImages.map((image, index) => {
                const isFirstImage = index === 0;

                return ( <
                    div key = { image.url }
                    className = { `image ${isFirstImage ? "featured" : ""} ${image.isSelected ? "selected" : ""}` }
                    onClick = {
                        () => toggleImageSelection(image)
                    } >
                    <
                    img src = { image.url }
                    height = { isFirstImage ? "400" : "200" }
                    alt = "upload" / >
                    <
                    input type = "checkbox"
                    checked = { image.isSelected }
                    onChange = {
                        () => toggleImageSelection(image)
                    }
                    /> < /
                    div >
                );
            })
        } <
        /div>

        <
        Modal isOpen = { isModalOpen }
        onRequestClose = { closeModal }
        contentLabel = "Image Slideshow"
        ariaHideApp = { false } > {
            selectedImageIndex !== null && ( <
                div className = "slideshow" >
                <
                img src = { selectedImages[selectedImageIndex].url }
                alt = "Slideshow"
                className = "slideshow-image" / >
                <
                button className = "slideshow-prev-btn"
                onClick = { previousSlide } >
                Previous <
                /button> <
                button className = "slideshow-next-btn"
                onClick = { nextSlide } >
                Next <
                /button> < /
                div >
            )
        } <
        /Modal> < /
        section >
    );
};

export default App;