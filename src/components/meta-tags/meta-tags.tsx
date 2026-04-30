import { defaultSiteMetadata } from "../../utils/constants";

interface MetaTagProps {
    title?: string,
    description?: string,
    canonicalUrl?: string,
    ogTitle?: string,
    ogUrl?: string,
    ogDescription?: string,
    ogImage?: string,
    themeColor?: string
}

const MetaTags = ({title, description, canonicalUrl, ogTitle, ogUrl, ogDescription, ogImage, themeColor}: MetaTagProps) => {
    
    return (
        <>
            <title>{title || defaultSiteMetadata.title}</title>
            <meta name="description" content={description || defaultSiteMetadata.description} />
            <link rel="canonical" href={canonicalUrl || defaultSiteMetadata.canonicalUrl} />
            <meta property="og:title" content={ogTitle || defaultSiteMetadata.ogTitle} />
            <meta property="og:url" content={ogUrl || defaultSiteMetadata.ogUrl} />
            <meta property="og:description" content={ogDescription || defaultSiteMetadata.ogDescription} />
            <meta property="og:image" content={ogImage || defaultSiteMetadata.ogImage} />
            <meta name="theme-color" content={themeColor || defaultSiteMetadata.themeColor} /> {/* TODO: make this change based on selected theme */}
        </>
    )
}

export default MetaTags;