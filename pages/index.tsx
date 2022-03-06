import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Header } from "../components";
import styles from "../styles/index.module.css";
import { SessionUtils, StorageUtils } from "../utils";
import { preventDefault } from "../utils/react-utils";

const Index: NextPage = () => {
  const router = useRouter();

  const createUser = (evt: React.FormEvent<HTMLFormElement>) => {
    const form = new FormData(evt.currentTarget);
    const username = form.get("username");

    fetch("/api/login", {
      method: "POST",
      redirect: "follow",
      body: JSON.stringify({ username }),
    })
      .then((res) => {
        if (res.redirected) {
          router.push(res.url);
        }
        if (res.status === 200) {
          router.reload();
        }
      })
      .catch((e) => console.error(e));
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Bingo</title>
        <meta name="description" content="Bingo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
        <form
          onSubmit={preventDefault(createUser)}
          className={styles.loginForm}
        >
          <label>
            Choose an username
            <input
              type="text"
              id="username"
              name="username"
              required
              min={3}
              max={64}
            />
          </label>
          <button type="submit">Start the bingo!</button>
        </form>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const username = SessionUtils(req, res).user.get();

  if (username) {
    const user = await StorageUtils.user(username).get();

    if (user) {
      return {
        redirect: {
          permanent: false,
          destination: `/${user.gameId}`,
        },
      };
    }
  }

  return { props: {} };
};

export default Index;
