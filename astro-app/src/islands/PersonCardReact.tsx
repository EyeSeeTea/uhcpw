import React, { useCallback, useState } from "react";
const AVATAR_FALLBACK = "/images/avatar-empty.png";

export interface PersonCardReactProps {
    person: {
        image: string;
        firstName: string;
        lastName: string;
        position: string;
        institution?: string;
        countryName: string;
    };
}

export const PersonCardReact: React.FC<PersonCardReactProps> = React.memo(({ person }) => {
    const [imgSrc, setImgSrc] = useState(person.image);

    const handleImageError = useCallback(() => {
        setImgSrc(AVATAR_FALLBACK);
    }, []);

    const positionLines = person.position.replace(/\\n/g, "\n").split("\n");
    const institutionLines = person.institution
        ? person.institution.replace(/\\n/g, "\n").split("\n")
        : [];

    return (
        <div className="person-card" role="listitem">
            <div className="person-card-inner">
                <img
                    className="person-card-image"
                    src={imgSrc}
                    alt={`${person.firstName} ${person.lastName}`}
                    onError={handleImageError}
                />
                <div className="person-card-row">
                    <div className="person-card-info">
                        <div className="person-card-name">
                            <p className="person-card-name-first">{person.firstName}</p>
                            <p className="person-card-name-last">{person.lastName}</p>
                        </div>
                        <div>
                            {positionLines.map((line, index) => (
                                <p key={`pos-${index}`} className="person-card-text">
                                    {line}
                                </p>
                            ))}
                        </div>
                        {institutionLines.length > 0 && (
                            <div>
                                {institutionLines.map((line, index) => (
                                    <p key={`inst-${index}`} className="person-card-text">
                                        {line}
                                    </p>
                                ))}
                            </div>
                        )}
                        <p className="person-card-text">{person.countryName}</p>
                    </div>
                </div>
            </div>
        </div>
    );
});

PersonCardReact.displayName = "PersonCardReact";
