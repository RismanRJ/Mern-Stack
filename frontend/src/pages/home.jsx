import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Container,
  HStack,
  Heading,
  Image,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { CiStar } from "react-icons/ci";

const Home = () => {
  let cardList = [
    {
      image: `/images/needFix_logo.jpeg`,
      content: `Lorem ipsum, dolor sit amet consectetur adipisicing elit.
    Excepturi voluptatibus cum vel laudantium dolor doloremque ut
    maxime, quisquam repudiandae odit voluptates reiciendis, quod
    unde! Quam!`,
      ratingIcon: <CiStar />,
      price: `$245`,
      ratingIconCount: 5,
      reviewsCount: 5,
    },
  ];
  return (
    <>
      <Container>
        <SimpleGrid
          columns={{
            base: 2,
            sm: 2,
            md: 4,
          }}
          h={"100vh"}
          w={"100%"}
          alignItems={"center"}
        >
          {cardList.map((val) => (
            <p>hii</p>
          ))}
          <Card boxShadow={"2px 2px 15px black"} w={250}>
            <CardHeader>
              <Image src="/images/needFix_logo.jpeg" />
            </CardHeader>
            <CardBody>
              <Text></Text>

              <HStack spacing={0}>
                <CiStar />
                <CiStar />
                <CiStar />
                <CiStar />
                <CiStar />
                <Text>(5 Reviews) </Text>
              </HStack>
              <Heading>$245</Heading>
            </CardBody>
            <CardFooter>
              <Button w={"full"} bg={"orange.400"}>
                View Details
              </Button>
            </CardFooter>
          </Card>
        </SimpleGrid>
      </Container>
    </>
  );
};

export default Home;
