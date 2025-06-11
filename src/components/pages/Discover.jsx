import Footer from "../Footer"
import Header from "../Header"
import { RecommendedCards } from "../ReccomendedCards"
import Searchbar from "../SearchBar"

const mockdata = [{
    id: 1,
    name: "Luxe Beauty Salon",
    description: "Premium beauty services with expert stylists",
    rating: 4.8,
    image: "/salon1.jpg"
  },
  {
    id: 2,
    name: "Glamour Studio",
    description: "Trendsetting styles and superior service",
    rating: 4.6,
    image: "/salon2.jpg"
  },
  {
    id: 3,
    name: "Elite Hair Spa",
    description: "Luxurious treatments and professional care",
    rating: 4.7,
    image: "/salon3.jpg"
  },
  {
    id: 1,
    name: "Luxe Beauty Salon",
    description: "Premium beauty services with expert stylists",
    rating: 4.8,
    image: "/salon1.jpg"
  },
  {
    id: 2,
    name: "Glamour Studio",
    description: "Trendsetting styles and superior service",
    rating: 4.6,
    image: "/salon2.jpg"
  },
  {
    id: 3,
    name: "Elite Hair Spa",
    description: "Luxurious treatments and professional care",
    rating: 4.7,
    image: "/salon3.jpg"
  },]
function Discover(){
    return(
        <>
        <div className="mb-20 pb-10" >
        <Header></Header>
        </div>
        <Searchbar></Searchbar>
        {/* <RecommendedCards data={mockdata}></RecommendedCards> */}
        <Footer></Footer>
        </>
    )
}

export default Discover