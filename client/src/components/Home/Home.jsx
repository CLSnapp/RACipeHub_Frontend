import { useState, useEffect } from "react";
import { useGetRecipesQuery } from "../Recipes/RecipesSlice";
import { useNavigate } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import { Link } from "react-router-dom";

export default function Home() {
  const { data, isSuccess, isLoading, error } = useGetRecipesQuery();
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [carouselRecipes, setCarouselRecipes] = useState([]);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleClick = (event) => {
    event.preventDefault();
    if (email && email.includes("@")) {
      setMessage("Thanks for subscribing!");
    } else {
      setMessage("Please enter a valid email address.");
    }
  };

  const seeRecipeDetails = (id) => navigate(`/recipes/${id}`);
  const seeAllRecipes = () => navigate(`/recipes`);

  const getRandomRecipes = (recipes, num) => {
    if (!recipes || recipes.length === 0) return [];
    const shuffled = [...recipes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  };

  useEffect(() => {
    if (isSuccess && data?.length > 0) {
      setFeaturedRecipes(getRandomRecipes(data, 3));
      setCarouselRecipes(getRandomRecipes(data, 7));
    }
  }, [data, isSuccess]);

  console.log(featuredRecipes);

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
  };

  const renderStarAverage = (rating) => {
    const totalStars = 5;
    let stars = [];

    for (let i = 0; i < totalStars; i++) {
      if (i < rating) {
        stars.push(
          <span key={i} className="star-rating">
            <i className="bi bi-star-fill"></i>
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="star-rating-empty">
            <i className="bi bi-star-fill"></i>
          </span>
        );
      }
    }

    return stars;
  };

  console.log("REVIEW", data?.recipe);

  return (
    <>
      <div className="masthead-container">
        <section className="masthead">
          <div className="masthead-content">
            <h1
              className="display-6"
              style={{ fontVariantCaps: "small-caps", fontWeight: "bold" }}
            >
              The RACipe Hub
            </h1>
            <p className="lead">
              A central space for all things food, offering the essence of a
              community-driven recipe platform.
            </p>
            <p>
              <Link to="/register">
                <button type="button" className="button-details-alt">
                  <strong>Get Started</strong>
                </button>
              </Link>
            </p>
          </div>
        </section>
      </div>
      <div className="container">
        <div className="home-container">
          <div>
            <h3 className="mt-4">Trending Now</h3>
            <Carousel>
              {carouselRecipes.map((recipe) => (
                <Carousel.Item
                  key={recipe.id}
                  onClick={() => seeRecipeDetails(recipe.id)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    className="d-block w-100"
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "cover",
                      borderRadius: "15px",
                    }}
                    src={
                      recipe.photo ||
                      "https://placehold.co/800x400?text=No+Photo+Available"
                    }
                    alt={recipe.name}
                  />
                  <Carousel.Caption>
                    <p>
                      <button
                        onClick={() => seeRecipeDetails(recipe.id)}
                        className="btn text-white pb-0 pt-2"
                        style={{ background: "#245e94" }}
                      >
                        <h4>{recipe.name}</h4>
                      </button>
                    </p>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
          <p className="text-center">
            {isLoading && "Loading recipes..."}
            {error && "Error loading recipes."}
          </p>
          <div>
            <p className="lead">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
              commodo dignissim lorem non consequat. Duis pharetra euismod
              dignissim.
            </p>
            <p>
              Donec libero libero, sagittis non arcu et, aliquam sagittis
              ligula. Vivamus ornare augue id magna luctus, nec aliquet erat
              laoreet. Aliquam erat volutpat. Praesent vitae turpis nec dui
              ultricies rhoncus nec sit amet leo. Vestibulum ante ipsum primis
              in faucibus orci luctus et ultrices posuere cubilia curae.
            </p>
          </div>

          <h3 className="mt-4">Featured Recipes</h3>
          <div className="row">
            {featuredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="col-md-4"
                style={{ marginBottom: "10px" }}
              >
                <div className="card bg-dark text-white h-100">
                  {recipe?.photo ? (
                    <img
                      src={
                        recipe.photo ||
                        "https://placehold.co/600x600?text=No+Photo+Available"
                      }
                      className="card-img-top"
                      alt={recipe.name}
                      style={{
                        width: "100%",
                        height: "250px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <img
                      src="https://placehold.co/600x600?text=No+Photo+Available"
                      className="card-img-top"
                      style={{
                        width: "100%",
                        height: "250px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title mb-0">{recipe.name}</h5>
                    <p className="small mb-0 pb-0">
                      <i>
                        by {recipe.user.firstName} {recipe.user.lastName[0]}
                      </i>
                    </p>
                    <p className="mb-0 pb-0">
                      {recipe.review &&
                        recipe.review.length > 0 &&
                        renderStarAverage(
                          Math.round(calculateAverageRating(recipe.review))
                        )}
                    </p>
                    <div className="card-body">
                      <p>
                        <button
                          onClick={() => seeRecipeDetails(recipe.id)}
                          className="button-details"
                          style={{
                            position: "absolute",
                            bottom: "0",
                            left: "15px",
                            margin: "10px 0",
                          }}
                        >
                          View Recipe Details
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* <button onClick={seeAllRecipes} className="btn btn-secondary mt-4">
            Show All Recipes
          </button> */}
          <button onClick={seeAllRecipes} className="button-details-alt mt-2">
            <strong>Show All Recipes</strong>
          </button>

          <h5 className="mt-5">Join our newsletter:</h5>
          <form>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="button-details mt-2" onClick={handleClick}>
              Subscribe
            </button>
            <br />
            <br />
            <p>{message}</p>
          </form>
        </div>
      </div>
    </>
  );
}
