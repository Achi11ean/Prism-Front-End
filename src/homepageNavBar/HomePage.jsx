import React, { useState } from 'react';
import './HomePage.css';
import CalendarComponent from '../Calendar';
function HomePage() {
    const [isExpanded, setIsExpanded] = useState(false);



    const [expandedSections, setExpandedSections] = useState({
        venue: false,
        artist: false,
        attendee: false,
        admin: false,
        event: false,
        tour: false
    });

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    return (
        <div className="homepage">
            <span id="rainbow2"><h1 id="rainbow">PRISM</h1></span>
            <p className="light">Transforming talent into a spectrum of experience</p>

            <button onClick={toggleExpand} className="toggle-buttons">
                {isExpanded ? 'Hide Information' : 'Show More Information'}
            </button>

            {isExpanded && (
                <div className="additional-info">
                    <p className="explained">
                    Here is some more information about Prism: how to decide your user type, how to use the site, and our mission to connect talent with unique experiences. We believe in creating moments that reflect the diversity and vibrancy of our communities.                    </p>
                    
                    {/* Collapsible section for Venues */}
                    <div>
                        <h3 className="usertype" onClick={() => toggleSection('venue')}>Venues {expandedSections.venue ? '▼' : '►'}</h3>
                        {expandedSections.venue && (
                            <div className="usersection">
                                <p>Creating a Venue profile is synonymous to 'Event Planner': for anyone who brings artists together and provides compensation to them for their performances at events that gather attendees. This is not limited to business with a physical address as venues sometimes partner with other businesses to utilize their space for the event being held. 
                                You can provide the:</p>
                                <ul>
                                    <li><strong>Venue name:</strong> [CT: Venue name] - including the state abbreviation allows your venue to be searched by state!</li>
                                    <li><strong>Organizer Name</strong></li>
                                    <li><strong>Email</strong></li>
                                    <li><strong>Average earnings of artists:</strong> Indicate payment type (e.g., cash, cover, free drinks)</li>
                                    <li><strong>Description:</strong> Include social media, types of events, etc.</li>
                                    <li><strong>Venue Rating:</strong> Ratings are averaged based on attendee feedback.</li>
                                </ul>
                                <p>                    You can also Edit and DELETE your venue to provide it with the latest data available or to remove it completely at your wish or make another venue if you operate more than one. You CANNOT edit or delete other user's data. (see Admin for exceptions on this rule). 
                    You Can also CREATE/EDIT/DELETE in EVENTS and Tours. For more details see Events and Tours listed below user types.
                    You can also Search artists to find local artists near you who match your venue vibes and contact them for your next events, you will also see how many fans they have to know if they have a great following you'd like to bring to your Venue! You can also search attendees and find attendees who have rated your venue and see what kind of events, artists, event types the attendee's like in order to cater your next experience to popular demands!</p>
                            </div>
                        )}
                    </div>

                    {/* Collapsible section for Artists */}
                    <div>
                        <h3 className="usertype" onClick={() => toggleSection('artist')}>Artists {expandedSections.artist ? '▼' : '►'}</h3>
                        {expandedSections.artist && (
                            <div className="usersection">
                                <p>Creating an artist profile is for anyone who performs, including singers, dancers, and more.</p>
                                <ul>
                                    <li><strong>Stage Name</strong></li>
                                    <li><strong>Age (18+)</strong></li>
                                    <li><strong>Background:</strong> Add social media, goals, and performance details.</li>
                                    <li><strong>Songs:</strong> Include song types or links to performances online.</li>
                                    <li><strong>Events:</strong> Link to events you’re performing at.</li>
                                    <li><strong>Fans:</strong> Attendees who mark you as their favorite.</li>
                                </ul>
                                <p>                        As an artist you can edit or DELETE your entry or create another artist profile if you wish to; however you CANNOT edit/delete another user's data. (see Admin for exceptions on this rule).
                        You Can also CREATE/EDIT/DELETE in EVENTS and Tours. For more details see Events and Tours listed below user types.
                        You can also search Venues to find local venues booking who match your vibe and see what the average pay is for their performers or request a door cover! If you have a lot of fans feel free to leverage that when contacting the venue to promote how many people you will be able to bring in to ask for more than they usually pay performers! </p>
                            </div>
                        )}
                    </div>

                    {/* Collapsible section for Attendees */}
                    <div>
                        <h3 className="usertype" onClick={() => toggleSection('attendee')}>Attendees {expandedSections.attendee ? '▼' : '►'}</h3>
                        {expandedSections.attendee && (
                            <div className="usersection">
                                <p>If you don't identify with the other two user type options [Artist and Venue], chances are you're an Attendee! <br/>Attendees are people who go to events to support local entertainers/venues and follow them to see their latest upcoming performances or tours!
                                Attendees can create a Profile with: </p>
                                <ul>
                        <li><strong><em>First Name</em></strong></li>    
                        <li><strong><em>Last Name</em></strong></li>    
                        <li><strong><em>Email</em></strong></li> 
                        <li><strong><em>Social Media:</em></strong> Enter the Platform in one spot [instagram, twitter, etc.] and the UserName in the next below[@HarmonicEssence].</li> 
                        <li><strong><em>Favorite Event Types:</em></strong> Choose from a list of common event types like: karaoke, open mic, drag shows, etc.</li>    
                        <li><strong><em>Favorite Artists:</em></strong> Choose from the available artists in our Database, if there are a lot of artists you can simply search an artist then select the drop down to see matching artists. This will make you a 'Fan' of that artist on their profile.</li>    
                        <li><strong><em>Favorite Events:</em></strong> Choose from the list of available favorite events in the system; this will let venues/artists know what their favorites were!</li>    
                        <li><strong><em>Favorite Venue:</em></strong> This allows you to give a rating on a scale of 1-5 for the venue where it will be added to a list of other attends who reviewed them and provide an average. </li>  
                    </ul> 
                    <p>Attendees can also Search for Venues, Artists, Events, Tours and Attendees. 
                    You can edit and DELETE your own attendees and create more attendees (for families where a parent holds the profiles but is able to create multiple attendees to express their like of an artist or venue!)
                    can CANNOT delete or edit other user's data (see Admin for exceptions.)</p>
                            </div>
                        )}
                    </div>

                    {/* Collapsible section for Admins */}
                    <div>
                        <h3 className="usertype" onClick={() => toggleSection('admin')}>Admin {expandedSections.admin ? '▼' : '►'}</h3>
                        {expandedSections.admin && (
                            <div className="usersection">
                                <p>Admin Accounts can only be created by existing Admin accounts. <br/>
                    Admin's have been given full creative control over the website, they can edit, delete, search or create anything they want to regardless of who created the data. 
                    They are also given permission to alter user's profile type or delete a user completely from the system - this will delete everything associated with the user and completely wipe all of their data from the system.
                    As the user list grows you can also search users using the searchbar for convenience. 
                    Lastly, they are given Admin Metrics: if you're an admin you have an admin page available to you that show cases all the users and metric data such as:</p>
                                <ul>
                        <li>User ID</li>
                        <li>User Name</li>
                        <li>User Type</li>
                        <li>Profile completion status</li>
                        <li>Created at: date-time of When the user was created.</li>
                        <li>Last Login: date-time of the last time the user logged in</li>
                        <li>Actions: change or delete user. [cannot delete self from the system]</li>
                        <li>User Dashboard: </li>
                        <li>Total Active Users [last 30 days]</li>
                        <li>New Registrations [Last 30 days]</li>
                        <li>Daily log Ins [last 7 days]</li>
                    </ul>
                            </div>
                        )}
                    </div>

                    {/* Collapsible section for Events */}
                    <div>
                        <h3 className="usertype" onClick={() => toggleSection('event')}>Events {expandedSections.event ? '▼' : '►'}</h3>
                        {expandedSections.event && (
                            <div className="usersection">
                                <p>Only Venues, Artists, and Admins can create Events.</p>
                                <ul>
                    <li><strong><em>Name of the Event:</em></strong> [all event names must be unique!]</li>
                    <li><strong><em>Date:</em></strong></li>
                    <li><strong><em>Location: [CT: 1121 North Hampton Way, Plainville]</em></strong> A Format like this allows users to search by state for events</li>
                    <li><strong><em>Description:</em></strong> Owner the event, vibes, themes. attire and more!</li>
                    <li><strong><em>Venue:  </em></strong>this allows the venues to correlate themself to the event, when an artist creates an event they will select the NONE or N/A option. Feel free to search the available venues! </li>
                    <li><strong><em>Event Type: </em></strong>this showcases the type of event so people can search by event types to see events they're interested in.</li>
                    <li><strong><em>Artists: </em></strong>This is where you can show case the artists performing at the event! You will see a list of the available artists- if there is a lot try searching the artists then selecting the drop down!</li>
                    </ul> 
                            </div>
                        )}
                    </div>

                    {/* Collapsible section for Tours */}
                    <div>
                        <h3 className="usertype" onClick={() => toggleSection('tour')}>Tours {expandedSections.tour ? '▼' : '►'}</h3>
                        {expandedSections.tour && (
                            <div className="usersection">
                                <p>Only Venues, Artists and Admins can create Tours. Tours are collections of events with set dates, a description and associated Social Media's! This is where an artist or venue would collect a list of events they are hosting or performing at [Ex: holiday Season performances aybe you'd make a spooky tour or a thanksgiving or Christmas Tour!].</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {/* Calendar Component */}
            <div className="calendar-section">
                <CalendarComponent />
            </div>

        </div>
    );
}

export default HomePage;
