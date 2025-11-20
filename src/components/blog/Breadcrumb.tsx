import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${window.location.origin}/`
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        "item": `${window.location.origin}${item.href}`
      }))
    ]
  };

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol 
          className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
          itemScope 
          itemType="https://schema.org/BreadcrumbList"
        >
          <li 
            itemProp="itemListElement" 
            itemScope 
            itemType="https://schema.org/ListItem"
          >
            <Link 
              to="/" 
              className="flex items-center hover:text-foreground transition-colors"
              itemProp="item"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only" itemProp="name">Home</span>
              <meta itemProp="position" content="1" />
            </Link>
          </li>
          
          {items.map((item, index) => (
            <li 
              key={item.href}
              className="flex items-center gap-2"
              itemProp="itemListElement" 
              itemScope 
              itemType="https://schema.org/ListItem"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
              {index === items.length - 1 ? (
                <span 
                  className="font-medium text-foreground" 
                  itemProp="name"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link 
                  to={item.href} 
                  className="hover:text-foreground transition-colors"
                  itemProp="item"
                >
                  <span itemProp="name">{item.label}</span>
                </Link>
              )}
              <meta itemProp="position" content={String(index + 2)} />
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};
