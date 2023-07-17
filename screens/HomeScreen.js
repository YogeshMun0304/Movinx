import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {Bars3CenterLeftIcon, MagnifyingGlassIcon} from 'react-native-heroicons/outline'
import TrendingMovies from './components/TrendingMovies'
import MovieList from './components/movieList'
import { useNavigation } from '@react-navigation/native'
import Loading from './components/loading'
import { fetchTopRatedMovies, fetchTrendingMovies, fetchUpcomingMovies } from '../api/moviedb'



export default function HomeScreen() {
    const [trending, setTrending] = useState([])
    const [upcoming , setUpcoming] = useState([])
    const [topRated , setTopRated] = useState([])
    const navigation = useNavigation();
    const [loading , setLoading] = useState(true);
    useEffect(()=>{
      getTrendingMovies();
      getUpcomingMovies();
      getTopRatedMovies();
    },[]);
    const getTrendingMovies = async ()=>{
      const data = await fetchTrendingMovies();
      
      if(data && data.results) setTrending(data.results);
      setLoading(false)
    }
    const getUpcomingMovies = async ()=>{
      const data = await fetchUpcomingMovies();
      
      if(data && data.results) setUpcoming(data.results);
    }
    const getTopRatedMovies = async ()=>{
      const data = await fetchTopRatedMovies();
      
      if(data && data.results) setTopRated(data.results);
    }
  return (
    <View className='flex-1 bg-neutral-900'>
    <SafeAreaView className='mb-3'>
      <StatusBar style="light" />
      <View className=' flex-row justify-between items-center mx-4'>
        <Bars3CenterLeftIcon size="30" strokeWidth={2} color='green'/>
        <Text className="text-green-900 text-3xl font-bold ">M<Text className='text-white'>ovinx</Text></Text>
        <TouchableOpacity onPress={()=> navigation.navigate('Search')}>
            <MagnifyingGlassIcon size='30' strokeWidth={2} color='green'></MagnifyingGlassIcon>

        </TouchableOpacity>
         </View>
    </SafeAreaView>
    {
        loading? (
          <Loading />
        ):(
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={{paddingBottom: 10}}
          >

            {/* Trending Movies Carousel */}
            { trending.length>0 && <TrendingMovies data={trending} /> }

            {/* upcoming movies row */}
            { upcoming.length>0 && <MovieList title="Upcoming" data={upcoming} /> }
            

            {/* top rated movies row */}
            { topRated.length>0 && <MovieList title="Top Rated" data={topRated} /> }

          </ScrollView>
        )
      }
      
  </View>
      

   
  )
}