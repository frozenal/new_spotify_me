/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from 'axios';
import { ExtendedArtist, SingleTrack } from '../types/spotifyTypes';
import { ArtistResponse } from './getTopArtists';
import { TrackResponse } from './getTopTracks';

type SpotifyData = {
  topArtists: {
    recentArtists: AxiosResponse<ArtistResponse, any>;
    allTimeArtists: AxiosResponse<ArtistResponse, any>;
  };
  topTracks: {
    recentTracks: AxiosResponse<TrackResponse, any>;
    allTimeTracks: AxiosResponse<TrackResponse, any>;
  };
  accessToken: string;
};

type ArtistTrackResponse = {
  tracks: SingleTrack[];
};

const getTopTrack = (tracks: SingleTrack[]) => {
  const trackInfo = {
    name: tracks[0].name,
    artist: tracks[0].artists[0].name,
    cover: tracks[0].album.images[0].url,
    url: tracks[0].external_urls.spotify
  };
  return trackInfo;
};

const getTopArtist = async (artist: ExtendedArtist[], accessToken: string) => {
  // get the artist's top track for display purposes
  const topTracks = await axios.get<ArtistTrackResponse>(
    'https://api.spotify.com/v1/artists/' +
      artist[0].id +
      '/top-tracks?country=US',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  const artistInfo = {
    name: artist[0].name,
    image: artist[0].images[0].url,
    url: artist[0].external_urls.spotify,
    topTrackName: topTracks.data.tracks[0].name,
    topTrackUrl: topTracks.data.tracks[0].external_urls.spotify
  };

  return artistInfo;
};

export type FormatReturnType = {
  topRecentTrack: ReturnType<typeof getTopTrack>;
  topAllTimeTrack: ReturnType<typeof getTopTrack>;
  topRecentArtist: Awaited<ReturnType<typeof getTopArtist>>;
  topAllTimeArtist: Awaited<ReturnType<typeof getTopArtist>>;
};

export const formatData = async (data: SpotifyData) => {
  const { topArtists, topTracks } = data;
  // get top track from toptracks using gettoptrack
  const topRecentTrack = getTopTrack(topTracks.recentTracks.data.items);
  const topAllTimeTrack = getTopTrack(topTracks.allTimeTracks.data.items);
  const topRecentArtist = await getTopArtist(
    topArtists.recentArtists.data.items,
    data.accessToken
  );
  const topAllTimeArtist = await getTopArtist(
    topArtists.allTimeArtists.data.items,
    data.accessToken
  );
  return {
    topRecentTrack,
    topAllTimeTrack,
    topRecentArtist,
    topAllTimeArtist
  };
};
