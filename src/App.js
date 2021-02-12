import DirectoryList from "ui/components/DirectoryList";

const fetchOffersList = () => {
    return [];
};

export default function App() {
    return (
        <>
            <div class="container mx-auto">
                {/* <p class="py-4 text-lg text-center">Start here :) Good luck!</p> */}
                <DirectoryList offerList={fetchOffersList()} />
            </div>
        </>
    );
}
