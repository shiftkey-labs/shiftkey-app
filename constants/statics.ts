import { Image } from "@/types/event";

const dummyImageUrl =
    "https://shiftkeylabs.ca/wp-content/uploads/2022/12/Shiftkey-Labs-Logo-01-e1487284025704-1200x515-1.png";

const dummyImage: Image = {
    id: 'dummy',
    url: "https://shiftkeylabs.ca/wp-content/uploads/2022/12/Shiftkey-Labs-Logo-01-e1487284025704-1200x515-1.png",
    filename: 'dummy.png',
    size: 0,
    type: 'image/png',
    thumbnails: {
        small: {
            url: "https://shiftkeylabs.ca/wp-content/uploads/2022/12/Shiftkey-Labs-Logo-01-e1487284025704-1200x515-1.png",
            width: 100,
            height: 100
        },
        large: {
            url: "https://shiftkeylabs.ca/wp-content/uploads/2022/12/Shiftkey-Labs-Logo-01-e1487284025704-1200x515-1.png",
            width: 500,
            height: 500
        },
        full: {
            url: "https://shiftkeylabs.ca/wp-content/uploads/2022/12/Shiftkey-Labs-Logo-01-e1487284025704-1200x515-1.png",
            width: 1000,
            height: 1000
        }
    }
};

export { dummyImageUrl, dummyImage };
