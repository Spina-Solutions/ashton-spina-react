type Article = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: 'article' | 'podcast';
  url?: string;
  content?: string;
};

type Data = {
  article: Article;
};

const article: Article = {
  id: 'travel-photography-tips',
  title: 'Travel Photography Tips: Capturing the World',
  excerpt: 'Essential tips and techniques for capturing stunning travel photographs that tell compelling stories from around the world.',
  date: '2024-03-15',
  readTime: '12 min read',
  category: 'article' as const,
  content: `# Travel Photography Tips: Capturing the World

Travel photography is more than just taking pictures while you're away from home. It's about capturing moments, cultures, and stories that transport viewers to the places you've been. Whether you're a beginner with a smartphone or an experienced photographer with professional gear, these tips will help you create more compelling travel photographs.

## Before You Go

### Research Your Destination

Before you arrive at your destination, spend time researching:
- Iconic locations and landmarks
- Local customs and photography restrictions
- Best times of day for natural lighting
- Cultural events or festivals during your visit
- Weather patterns and seasonal considerations

Understanding your destination helps you plan your shots and avoid missing important opportunities.

### Pack Smart

Traveling light is crucial, but so is being prepared:
- Choose versatile lenses (a 24-70mm zoom is often ideal)
- Bring extra batteries and memory cards
- Consider a lightweight tripod for low-light situations
- Pack lens cleaning supplies
- Protect your gear with appropriate bags and weather protection

Remember: the best camera is the one you have with you. Don't let heavy gear prevent you from exploring.

## Composition Techniques

### The Rule of Thirds

Place key elements along the intersecting points of a 3x3 grid. This creates more dynamic, balanced compositions than centering your subject.

### Leading Lines

Use natural or architectural lines to guide the viewer's eye through your photograph:
- Roads and pathways
- Rivers and coastlines
- Building edges and railings
- Shadows and light patterns

### Frame Within a Frame

Look for natural frames to add depth:
- Archways and doorways
- Windows and mirrors
- Tree branches
- Architectural elements

### Change Your Perspective

Don't just shoot from eye level:
- Get low to the ground for dramatic angles
- Find elevated vantage points
- Shoot through objects for unique compositions
- Get closer than you think you should

## Lighting Mastery

### Golden Hour Magic

The hour after sunrise and before sunset provides:
- Soft, warm, flattering light
- Long shadows for depth
- Rich colors in the sky
- Less harsh contrast

### Blue Hour Beauty

The period just before sunrise and after sunset offers:
- Deep blue skies
- City lights becoming visible
- A moody, atmospheric quality
- Opportunities for long exposures

### Embrace Bad Weather

Don't pack your camera away when conditions aren't perfect:
- Overcast skies provide even, diffused light
- Rain creates reflections and mood
- Fog adds mystery and depth
- Storms offer dramatic skies

## Capturing Culture and People

### Respect Local Customs

Always prioritize respect:
- Ask permission before photographing people
- Learn basic phrases in the local language
- Understand cultural sensitivities
- Be aware of religious sites' rules
- Consider offering to share photos with subjects

### Tell Stories

Great travel photos tell stories:
- Include context and environment
- Capture candid moments
- Show daily life and traditions
- Document details that reveal culture
- Create photo essays that flow together

### Interact Authentically

The best portraits come from genuine connections:
- Spend time with your subjects
- Show interest in their lives
- Share your own story
- Be patient and observant
- Smile and be friendly

## Technical Considerations

### Camera Settings for Travel

General starting points:
- Aperture Priority mode for flexibility
- ISO: As low as possible for your lighting
- Aperture: f/8-f/11 for landscapes, f/2.8-f/5.6 for portraits
- Shoot in RAW for maximum editing flexibility
- Use continuous shooting for action

### Smartphone Photography

Modern smartphones are incredibly capable:
- Clean your lens regularly
- Use HDR mode for high-contrast scenes
- Try portrait mode for subject separation
- Experiment with third-party camera apps
- Edit with mobile apps like Lightroom Mobile or VSCO

### Backup Your Photos

Protect your memories:
- Bring multiple memory cards
- Back up to a portable hard drive nightly
- Use cloud storage when WiFi is available
- Never delete photos until they're backed up
- Consider a photo backup device

## Post-Processing Tips

### Develop Your Style

Consistency creates a cohesive portfolio:
- Create and save presets for efficiency
- Develop a color palette you're drawn to
- Be subtle with adjustments
- Maintain natural-looking edits
- Let the location's character shine through

### Essential Edits

Focus on these key adjustments:
- Exposure and contrast
- White balance correction
- Highlight and shadow recovery
- Vibrance and saturation (use sparingly)
- Sharpening and noise reduction
- Straightening and cropping

### Mobile Editing

You don't need a desktop to edit:
- Adobe Lightroom Mobile (free and powerful)
- Snapseed (excellent free option)
- VSCO (great filters and tools)
- TouchRetouch (for removing unwanted elements)

## Practical Tips

### Wake Up Early

The early bird gets the shot:
- Fewer crowds at popular locations
- Better light quality
- Quieter, more peaceful atmosphere
- Opportunity to see daily routines

### Scout Locations

Visit locations twice when possible:
- Scout during the day to plan your shots
- Return during golden hour for the best light
- Note sun direction and movement
- Identify the best vantage points

### Be Patient

Great shots often require waiting:
- Wait for the right light
- Observe patterns in human activity
- Let scenes unfold naturally
- Return to locations multiple times if needed

### Stay Safe

Safety should always come first:
- Be aware of your surroundings
- Don't draw unnecessary attention to expensive gear
- Use camera straps and secure bags
- Avoid dangerous situations for a photo
- Trust your instincts

## Common Mistakes to Avoid

### Over-Shooting

Quality over quantity:
- Be intentional with your shots
- Take time to compose properly
- Don't rely on "fixing it in post"
- Enjoy the moment, not just through a lens

### Ignoring the Foreground

Add depth and context:
- Include interesting foreground elements
- Create layers in your compositions
- Use wide-angle lenses effectively
- Balance foreground with background

### Not Backing Up

Protect your work:
- Never rely on a single copy
- Back up before deleting from cards
- Use the 3-2-1 rule (3 copies, 2 different media, 1 off-site)

## Final Thoughts

Travel photography is a journey of continuous learning and experimentation. Don't get so caught up in getting the perfect shot that you forget to experience the moment. Sometimes the best memories aren't the ones you capture through your lens.

Remember:
- Technical skills can be learned, but vision takes time to develop
- Your unique perspective is what makes your photos special
- Mistakes are opportunities to learn
- The best photos often come from unexpected moments
- Enjoy the process and have fun

Now get out there and start capturing the world!

## Recommended Resources

### Books
- "The Travel Photography Book" by Scott Kelby
- "Within the Frame" by David duChemin
- "The Photographer's Eye" by Michael Freeman

### Online Communities
- National Geographic Your Shot
- 500px Travel Photography
- Instagram travel photography hashtags
- Reddit r/travel and r/photography

### Inspiration
- Steve McCurry
- Jimmy Chin
- Chris Burkard
- Murad Osmann
- Local photographers at your destinations

Happy shooting!`
};

export default function data() {
  console.log('Data loader returning:', { article });
  return {
    article
  };
}

