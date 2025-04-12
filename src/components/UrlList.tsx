interface Url {
    short_url: string;
  }
  
  export default function UrlList({ urls }: { urls: Url[] }) {
    return (
      <div>
        {urls.length === 0 ? (
          <p>No URLs shortened yet.</p>
        ) : (
          <ul className="space-y-2">
            {urls.map((url, index) => (
              <li key={index}>
                <a href={url.short_url} className="text-blue-500">{url.short_url}</a>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }