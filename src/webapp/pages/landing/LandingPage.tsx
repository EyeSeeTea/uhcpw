import React from "react";
import { Map } from "../../components/map/Map";

export const LandingPage: React.FC = React.memo(() => {
    //const history = useHistory();
    // const { currentUser } = useAppContext();

    // const cards: Card[] = [
    //     {
    //         title: "Section",
    //         key: "main",
    //         children: [
    //             {
    //                 name: "John",
    //                 description: "Entry point 1",
    //                 listAction: () => history.push("/for/John"),
    //             },
    //             {
    //                 name: "Mary",
    //                 description: "Entry point 2",
    //                 listAction: () => history.push("/for/Mary"),
    //             },
    //         ],
    //     },
    // ];

    return (
        <>
            {/* <CardGrid cards={cards} />
            <Typography variant="h6">
                {" "}
                Current user: {currentUser.name} [{currentUser.id}]
            </Typography> */}
            <Map />
        </>
    );
});
