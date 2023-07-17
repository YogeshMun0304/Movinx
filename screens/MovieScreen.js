import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import { fallbackMoviePoster, fetchMovieCredits, fetchMovieDetails, fetchSimilarMovies, image500 } from '.././api/moviedb';
var { width, height } = Dimensions.get("window");
import Cast from './components/cast'
import MovieList from "./components/movieList";
import Loading from "./components/loading";
export default function MovieScreen() {
  const MovieName = "vsdhgfhdg";
  const navigation = useNavigation();
  const [favourite, setFavourite] = useState(false);
  const [movie, setMovie] = useState({});
  const [cast, setCast] = useState([])
  const [similarMovies, setSimilarMovies] = useState([])
  const [loading , setLoading] = useState(false);
  

  const { params: item } = useRoute();
  useEffect(()=>{
    setLoading(true);
    getMovieDetials(item.id);
    getMovieCredits(item.id);
    getSimilarMovies(item.id);
  },[item]);

  const getMovieDetials = async id=>{
    const data = await fetchMovieDetails(id);
   
    setLoading(false);
    if(data) {
        setMovie({...movie, ...data});
        
    }
  }
  const getMovieCredits = async id=>{
    const data = await fetchMovieCredits(id);
    
    if(data && data.cast){
        setCast(data.cast);
    }

  }
  const getSimilarMovies = async id=>{
    const data = await fetchSimilarMovies(id);
 
    if(data && data.results){
        setSimilarMovies(data.results);
    }

  }
  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 20 }}
      className="bg-neutral-900"
    >
      <View className="w-full">
        <SafeAreaView className="absolute z-20 flex-row w-full justify-between items-center px-4 mt-3">
          <TouchableOpacity
            className="rounded-xl p-1 bg-green-900"
            onPress={() => {
              navigation.goBack();
            }}
          >
            <ChevronLeftIcon size="30" strokeWidth={2} color="white" />
          </TouchableOpacity>
          <TouchableOpacity className="">
            <HeartIcon
              size="35"
              color={favourite ? "green" : "white"}
              onPress={() => {
                setFavourite(!favourite);
              }}
            />
          </TouchableOpacity>
        </SafeAreaView>
        {
      loading ? (<Loading/>)
      :(
        <View className='rounded-b-[50px] border-b border-green-500'>
          <Image
            source={{uri: image500(movie.poster_path) || fallbackMoviePoster}}
            style={{ width, height: height * 0.55 }}
            className="rounded-b-[50px]"
          />
        </View>)}
      </View>
      <View className="space-y-3">
        {/* title */}
        <Text className="text-white text-center text-3xl font-bold tracking-widest">
            {
                movie?.title
            }
        </Text>

        {/* status, release year, runtime */}
        {
            movie?.id? (
                <Text className="text-neutral-400 font-semibold text-base text-center">
                    {movie?.status} • {movie?.release_date || 'N/A'} • {movie?.runtime} min
                </Text>
            ):null
        }
        

        
        {/* genres  */}
        <View className="flex-row justify-center mx-4 space-x-2">
            {
                movie?.genres?.map((genre,index)=>{
                    let showDot = index+1 != movie.genres.length;
                    return (
                        <Text key={index} className="text-neutral-400 font-semibold text-base text-center">
                            {genre?.name} {showDot? "•":null}
                        </Text>
                    )
                })
            }
        </View>

        {/* description */}
        <Text className="text-neutral-400 mx-4 tracking-wide">
            {
                movie?.overview
            }
        </Text>
        
     </View>
        
      
      {/* cast */}
      {
        movie?.id && cast.length>0 && <Cast navigation={navigation} cast={cast} />
      }
      
      {
        movie?.id && similarMovies.length>0 && <MovieList title={'Similar Movies'} hideSeeAll={true} data={similarMovies} />
      }
      
    </ScrollView>
  );
}
