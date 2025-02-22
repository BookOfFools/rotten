package com.paridiso.cinema.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "UserProfiles")
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "profileImage")
    private String profileImage;

    @Column(name = "biography")
    private String biography;

    @Column(name = "registeredDate")
    private Date registeredDate;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private WatchList watchList;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private WishList wishList;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private FollowList followList;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private FollowYouList followYouList;

    @Column(name = "isCritic")
    private Boolean isCritic;

    @Column(name = "isPrivate")
    private Boolean isPrivate;

    @OneToMany(cascade = {CascadeType.MERGE}, fetch = FetchType.LAZY)
    private List<Review> reviews;

    @OneToMany(cascade = {CascadeType.MERGE}, fetch= FetchType.LAZY)
    private List<Review> likedReviews;

    @ManyToMany(cascade = {CascadeType.MERGE}, fetch = FetchType.LAZY)
    @JoinTable(
            name = "UserRatedMovies",
            joinColumns = {@JoinColumn(name = "id")},
            inverseJoinColumns = {@JoinColumn(name = "imdbId")}
    )
    @MapKeyColumn(name = "imdbId")
    private List<Movie> ratedMovies;
//
    @OneToMany(cascade = {CascadeType.MERGE}, fetch = FetchType.LAZY)
    private List<UserRating> userRatings;

    public UserProfile() {

    }

    public UserProfile(Integer id) {
        this.id = id;
    }

    public Boolean getCritic() {
        return isCritic;
    }

    public void setCritic(Boolean critic) {
        isCritic = critic;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public String getBiography() {
        return biography;
    }

    public void setBiography(String biography) {
        this.biography = biography;
    }

    public WatchList getWatchList() {
        return (watchList != null) ? watchList : new WatchList();
    }

    public void setWatchList(WatchList watchList) {
        this.watchList = watchList;
    }

    public WishList getWishList() {
        return (wishList != null) ? wishList : new WishList();
//        return wishList;
    }

    public void setWishList(WishList wishList) {
        this.wishList = wishList;
    }

    public Boolean getPrivate() {
        return isPrivate;
    }

    public void setPrivate(Boolean aPrivate) {
        isPrivate = aPrivate;
    }

    public Date getRegisteredDate() {
        return registeredDate;
    }

    public void setRegisteredDate() {
        Calendar cal = Calendar.getInstance();
        cal.setTime(new Timestamp(cal.getTime().getTime()));
        this.registeredDate = new Date(cal.getTime().getTime());
    }

    @Override
    public String toString() {
        return "UserProfile{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", profileImage='" + profileImage + '\'' +
                ", biography='" + biography + '\'' +
                ", watchList=" + watchList +
                ", wishList=" + wishList +
                ", isCritic=" + isCritic +
                '}';
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    public List<Review> getLikedReviews() {
        return likedReviews;
    }

    public void setLikedReviews(List<Review> likedReviews) {
        this.likedReviews = likedReviews;
    }

    public List<Movie> getRatedMovies() {
        return ratedMovies;
    }

    public void setRatedMovies(List<Movie> ratedMovies) {
        this.ratedMovies = ratedMovies;
    }

    public List<UserRating> getUserRatings(){return userRatings;}

    public void setUserRatings(List<UserRating> userRatings){this.userRatings = userRatings;}

    public FollowList getFollowList() {
        return followList;
    }

    public void setFollowList(FollowList followList) {
        this.followList = followList;
    }

    public FollowYouList getFollowYouList() {
        return followYouList;
    }

    public void setFollowYouList(FollowYouList followYouList) {
        this.followYouList = followYouList;
    }
}
