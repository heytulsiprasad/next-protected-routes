import styles from "@/styles/WeatherCard.module.scss";
import { inter, dancingScript } from "@/utils/fonts";
import { AiOutlineStar, AiFillStar, AiFillCloud } from "react-icons/ai";
import { FiWind } from "react-icons/fi";
import { WiHumidity } from "react-icons/wi";

const WeatherCard = ({ result }) => {
  return (
    <div className={styles.result}>
      <div className={styles.resultHeader}>
        <div>
          <h1 className={dancingScript.className}>
            {result.location.name}, {result.location.region}
          </h1>
        </div>
        <div className={styles.favIcon}>
          <AiOutlineStar
            size="24px"
            color="#FFDF00"
            style={{ marginTop: "5px" }}
          />
          {/* <AiFillStar
                    size="24px"
                    color="#FFDF00"
                    style={{ marginTop: "5px" }}
                  /> */}
        </div>
      </div>
      <div className={styles.resultDetails}>
        <div className={styles.resultDetailsLeft}>
          <img src={result.current.condition.icon} alt="Weather status" />
        </div>
        <div className={styles.resultDetailsMiddle}>
          <h2>{result.current.temp_c}&deg;C</h2>
          <p>{result.current.condition.text}</p>
        </div>
        <div className={styles.resultDetailsRight}>
          <div className={styles.resultDetailsInfo}>
            <div>
              <AiFillCloud />
            </div>
            <div>{result.current.cloud}%</div>
          </div>
          <div className={styles.resultDetailsInfo}>
            <div>
              <FiWind />
            </div>
            <div>{result.current.wind_kph}kph</div>
          </div>
          <div className={styles.resultDetailsInfo}>
            <div>
              <WiHumidity />
            </div>
            <div>{result.current.humidity}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
