export interface Article {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: 'article' | 'podcast';
  url?: string; // For external links (podcasts)
  content?: string; // For articles with individual pages
}

export const mediaItems: Article[] = [
  {
    id: 'ontario-city-problem',
    title: 'Ontario\'s City Problem',
    excerpt: 'Exploring the challenges facing urban development in Ontario and potential solutions for sustainable growth.',
    date: '2024-01-15',
    readTime: '8 min read',
    category: 'article',
    content: `# Ontario's City Problem

Ontario is facing a housing crisis. An infrastructure crisis. A traffic crisis. An urban sprawl crisis. The Greater Toronto Area (GTA) certainly best exemplifies these issues, but it exists to some extent in all major urban centers. Although, one should not discount the amazing growth of these distinctly North American urban conglomerates, almost doubling in size in the last 30 years in the case of the GTA, the issues they face now will limit their growth if not properly checked.

With the rapid growth of cities in Ontario and Canada as a whole via urbanization there has been a matched drive to increase the housing supply. In the case of places like the GTA this has been accomplished largely through the use of cheap, large, wooden-frame, individual or low-occupant houses of similar shape and appearance on relatively small plots. Although the kilometres of identical housing could definitely lead one to insist the Canadian solution to housing is an individualistic, North American take on Soviet housing schemes, a solution that solves the problem is a valid solution nonetheless. Nor could one complain about the choice of construction materials. Afterall, wood is a readily available resource in the region and is far and away the most cost-effective and environmentally friendly building material one could choose. Instead the problem lies with the side-effects of this viable, but decidedly Band-aid solution to the housing problem.

The region that best exemplifies the issues is the GTA. No one can doubt that GTA traffic is horrible. Toronto ranks at a healthy number 6 for worst cities in the world for commuters. This ranking is made worse by the fact that it's not even accompanied by the likes of cities such as Los Angeles or New York like one might expect, but rather decidedly less wealthy cities of the likes of Rio De Janeiro, Bogota, and Istanbul whose issues might more easily attributed to their lack of wealth or stability to solve the problem, rather than planning mismanagement alone. The GTA has no such excuses.

Although these issues may be relatively new to the GTA and Canada, having such small populations in the past, they're definitely not foreign on a global scale.

## Traffic

The discussion must take a necessary detour from housing to traffic. This is because the two are inextricably linked. One cannot address housing without first addressing the infrastructure to support it and the traffic that results otherwise. The flow of people is critical to any good housing solution and must begin here. If traffic was not a concern, the solution to any housing crisis, particularly in a country with as much space as Canada, becomes obvious: build more houses on more land. But, this is not the case as can be seen and this solution as currently approached simply increases commute times and traffic.

**TL;DR:** More cars on the road causes more traffic, regardless of road width.

Applying this logic to the GTA means starting with more, better, public transport. People often like to suggest that the public doesn't like public transport. Why would they? It's inconvenient. It can take 90 minutes to get from Etobicoke to Union Station without ever leaving one road: Lake Shore Boulevard. It takes on average 32% longer to commute by public transport as by car, and that's even with Toronto's horrible traffic. But, that's because the infrastructure is not up-to-par. Why during the day must one change trams on a direct route to Union Station? Why is a city with 600 000 people, Brampton, whose population is dependent on the Toronto core for employment and exists essentially as a suburb of the city, only running a couple trains a day to Union Station? Why is it so difficult to get from any given home to a GO station? If people need to maintain a car to just use public transport it's hardly desirable to use public transport.

## Housing

The issues with housing then are quite apparent. There's not enough places to live for the amount of people who want or need to live in a given place. The laws of supply and demand then dictate that housing must be expensive. Housing prices in Toronto sit at a (average price) : (average household income) ratio of 12:1. Above 3:1 is considered unaffordable. Clearly something must be done. Some people might shout rent controls or subsidized housing, but all those will do is shorten the supply of housing further and transfer taxpayer money to landlords respectively.

What to do?

## The Solutions

With a basic understanding of the issues, both movement of and housing of people-related, one can begin to consider the options to rectify these problems. Clearly there's only two obvious options for housing development in an expanding city so both should be discussed.

### Urban Sprawl

The first option is to continue with the current method of expansion. More houses and more urban sprawl. Urban sprawl often has negative connotations, but this is obviously the easier solution in terms of policy as it would mean no change to housing policy and people could continue with their current way of life, meaning no political capital is required. This is not necessarily a wrong solution, but it puts considerably more strain on the people-moving infrastructure. In the example of the GTA if this were the method that were decided upon for the future then a reliance on cars is going to remain. This is again manageable, but so much space will be wasted on cars. The title picture of this article does a good job of exemplifying the amount of space can be wasted on car-related infrastructure. With space at a premium, as already established, this becomes a sub-optimal solution.

This in mind: the only solution in this case would to be to build an absolutely phenomenal public transit system. Unfortunately, no Canadian city's public transit system is of even adequate quality compared to their global peers. Though no one would be upset if this were to suddenly and miraculously change, one would hesitate to trust the current system to build one of the world's most ambitious public transit systems with their current record.

### Intensification

The other option is to intensify. This means that current space should be redeveloped to increase the amount of people and services within a given area. This is the preferred method for most other metropoleis world-wide to handle housing concerns, which definitely gives it the weight of experience. Where this solution has its failings is in cost and materials.

Buildings that result from intensification are usually concrete and steel heavy. Although these are not exactly rare materials, they are considerably more costly than the lumber which is available in vast quantities in Canada. Therefore, in order to lower the cost of such an intensification programme, it would make sense for governments to explore new materials and options for building construction. An example of this is Cross-Laminated Timber (CLT). This material has already been used to build medium-height buildings in Canada and other countries. CLT has the advantage that is a material made entirely from wood, a renewable resource of vast abundance in Canada with a well developed extraction industry. As well, the environment benefits from the switch. Concrete and steel require vast amounts of energy and greenhouse gas emissions to produce and transport. CLT on the other hand is a carbon trap, gathering carbon from the atmosphere during its growth as trees and storing it in our buildings. This is just one example, but the big change should be subsidizing these new construction methods rather than relying on the exiting ones. By using a relatively lightweight material like CLT, Canada can begin a move towards pre-fabricated building components as well. Sections of much larger buildings can be constructed in an assembly-line and craned into position wherever they need to be placed. This can significantly reduce the ever-dreaded long construction times, a particularly important issue in Ontario's short optimal build season. Medium-sized apartment blocks (8-12 stories to avoid the high engineering costs and sunlight-blocking that come with taller buildings) can be integrated with with commercial zoning and public transport to reduce the need for cars. By reducing the distances between residential and commercial zones to essentially zero, by mixing them together, the need for car-based transport is reduced and thus more real-estate is freed for residential and commercial zoning, creating a feedback effect of improvement.

Some might be concerned that Canadians would not want the smaller living-spaces that come with apartments and would push back against such a change. Although, definitely people will push back against any change, Canadians actually prefer a living-space in the 1000-1500sq. ft. size range rather than the current Canadian average of 1792sq. ft.

**TL;DR:** Car infrastructure takes up a lot of space and limits cities.

This solution does not only apply to the GTA, although evidently the GTA has the largest housing problems. Many other major cities use the medium-sized apartment block strategy mixed with commercial zoning even in low-density areas. This allows people in extra-urban areas to benefit from the cost-saving and quality of life improvement of less car usage and preserves the environment as a bonus. Pre-fabricated build solutions would keep the costs of these constructions down and make them more viable in these low-density areas.

## Specific Recommendations

### Short-Term
- Move towards more mixed commercial and residential zoning rules
- Minimize transfers on public transportation routes
- Make dedicated Tram/Bus lanes and integrate these vehicles with traffic light timings to reduce public transport tardiness.
- Embrace superior road designs for existing infrastructure, eg. Diverging Diamond Interchanges, round-abouts.
- Shift existing lanes in the urban core to bike paths, separated from the car lanes with a curb, and with a separate traffic light cycle.

### Long-Term
- Move government subsidies to forward-thinking, made-for-Canada construction techniques: eg. (Cross-Laminated Timber, pre-fabricated building components)
- Increase the number of vehicles on public transportation routes, diverting funding from road expansion and increase route coverage.
- Change zoning in all areas to require a high quantity of high-density development and avoid issuing build permits for low-occupancy housing.
- Avoid superfluous develompent that wastes space that could be used for housing, eg. above-ground parking lots, street-side parking in the urban core or areas that have driveways, front-yards on houses.
- Embrace pedestrian-focused cities.

## The Sources
- [The Independent](https://www.independent.co.uk/travel/news-and-advice/commuting-cities-best-worst-ranked-london-rio-de-janeiro-nice-a8406031.html)
- [2016 Canadian Census](https://en.wikipedia.org/wiki/2016_Canadian_Census)
- [Demographics of Toronto](https://en.wikipedia.org/wiki/Demographics_of_Toronto)
- [Point2Homes](https://www.point2homes.com/news/canada-real-estate/how-large-are-canadian-homes.html)`
  },
  {
    id: 'tech-podcast-episode-1',
    title: 'Building Modern Web Applications',
    excerpt: 'A deep dive into modern web development practices, frameworks, and best practices.',
    date: '2024-01-10',
    readTime: '45 min listen',
    category: 'podcast',
    url: 'https://example.com/podcast/episode-1'
  },
  {
    id: 'travel-photography-tips',
    title: 'Travel Photography Tips: Capturing the World',
    excerpt: 'Essential tips and techniques for capturing stunning travel photographs that tell compelling stories from around the world.',
    date: '2024-03-15',
    readTime: '12 min read',
    category: 'article',
  }
];
