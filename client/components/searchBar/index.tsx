import React, {
  useState,
  useEffect,
  useRef,
  KeyboardEvent,
  FormEvent,
  useContext,
} from "react";
import { AppContext } from "../../context";
import { useRouter } from "next/router";
import { User } from "../../types";
import { searchUsersAPI } from "../../api";

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Partial<User>[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { user } = useContext(AppContext).appState;
  const router = useRouter();

  useEffect(() => {
    const handleClickInside = (event: MouseEvent) => {
      setShowDropdown(true);
    };
    const handleOutsideClick = (event: MouseEvent) => {
      setShowDropdown(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document;
    inputRef.current?.addEventListener("click", handleClickInside);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document;
      inputRef.current?.addEventListener("click", handleClickInside);
    };
  }, []);

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setQuery(value);
    handleSearchSubmit(event as any);
  };

  const handleSelect = (email: string) => {
    const encodedEmail = encodeURIComponent(email);
    router.push(`/users/${encodedEmail}`);
    setShowDropdown(false);
  };

  const handleSearchSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { users } = await searchUsersAPI(query);
    if (users.length) {
      setResults(users);
    } else {
      setResults([{ email: "No results found" }]);
    }
    setShowDropdown(true);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const id = (event.target as HTMLInputElement).id;

    switch (event.key) {
      case "Escape":
        setShowDropdown(false);
        break;
      case "Enter":
        event.preventDefault();
        if (id.includes("dropdown-item")) {
          const email = id.split("-").pop();
          handleSelect(email);
        }
        break;
      default:
        break;
    }
  };

  return (
    <nav className="nav">
      <a href="/" className={"logo"}>
        Todo
      </a>
      {user && (
        <form onSubmit={handleSearchSubmit}>
          <div className="search-bar">
            <input
              id="search-bar"
              type="text"
              placeholder="Search for users"
              value={query}
              ref={inputRef}
              onChange={handleSearch}
              onKeyDown={handleKeyDown}
            />
            <button
              ref={buttonRef}
              onKeyDown={(event: any) => handleKeyDown(event)}
              type="submit"
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
            {showDropdown && (
              <div className="search-dropdown">
                <ul>
                  {results.map((result, i) => (
                    <li
                      id={`search-dropdown-item-${result.email}`}
                      key={result.id}
                      onClick={() => handleSelect(result.email)}
                      onKeyDown={(event: any) => handleKeyDown(event)}
                      className="search-dropdown-item"
                      tabIndex={0}
                    >
                      {result.email}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </form>
      )}
    </nav>
  );
};

export default SearchBar;
