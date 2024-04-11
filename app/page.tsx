import Navbar from "./components/Navbar";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <h1>hi</h1>
      </main>
    </>
  );
}
