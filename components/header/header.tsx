import styles from "./header.module.css";

interface HeaderProps {
  username?: string;
}

export const Header = ({ username }: HeaderProps) => {
  return (
    <header className={styles.header}>
      <h1>Bingo</h1>
      {username ? (
        <div className={styles.user}>
          <span>{username}</span>
          <a href={"/api/logout"}>Log out!</a>
        </div>
      ) : (
        <div />
      )}
    </header>
  );
};
